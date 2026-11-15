package com.utsavmehta.todolist.data.local.security

import java.security.GeneralSecurityException
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import javax.inject.Inject
import javax.inject.Singleton

/**
 * PBKDF2-HMAC-SHA256 password hasher.
 *
 * Stored format: `pbkdf2_sha256$<iterations>$<base64 salt>$<base64 hash>`.
 * Pure JVM (no Android classes) so it can be unit tested without Robolectric.
 * Callers should run these CPU-bound methods on `Dispatchers.Default`.
 */
@Singleton
class PasswordHasher @Inject constructor() {

    private val random = SecureRandom()

    /** Hashes [password] with a fresh random salt and returns the encoded string. */
    fun hash(password: String): String {
        val salt = ByteArray(SALT_BYTES).also { random.nextBytes(it) }
        val key = deriveKey(password, salt, ITERATIONS, KEY_BITS)
        val encoder = Base64.getEncoder()
        return "$PREFIX\$$ITERATIONS\$${encoder.encodeToString(salt)}\$${encoder.encodeToString(key)}"
    }

    /**
     * Returns true when [password] matches the [encoded] hash.
     * Never throws: any malformed [encoded] value yields false.
     */
    fun verify(password: String, encoded: String): Boolean {
        val parts = encoded.split("\$")
        if (parts.size != 4 || parts[0] != PREFIX) return false

        val iterations = parts[1].toIntOrNull()?.takeIf { it > 0 } ?: return false
        val salt = decodeBase64(parts[2]) ?: return false
        val expectedHash = decodeBase64(parts[3]) ?: return false
        if (salt.isEmpty() || expectedHash.isEmpty()) return false

        val actualHash = try {
            deriveKey(password, salt, iterations, expectedHash.size * 8)
        } catch (e: GeneralSecurityException) {
            return false
        } catch (e: IllegalArgumentException) {
            return false
        }
        return MessageDigest.isEqual(expectedHash, actualHash)
    }

    private fun deriveKey(password: String, salt: ByteArray, iterations: Int, keyBits: Int): ByteArray {
        val chars = password.toCharArray()
        val spec = PBEKeySpec(chars, salt, iterations, keyBits)
        try {
            val secretKey = SecretKeyFactory.getInstance(ALGORITHM).generateSecret(spec)
            return checkNotNull(secretKey.encoded)
        } finally {
            spec.clearPassword()
            chars.fill('\u0000')
        }
    }

    private fun decodeBase64(value: String): ByteArray? =
        try {
            Base64.getDecoder().decode(value)
        } catch (e: IllegalArgumentException) {
            null
        }

    private companion object {
        const val PREFIX = "pbkdf2_sha256"
        const val ALGORITHM = "PBKDF2WithHmacSHA256"
        const val ITERATIONS = 120_000
        const val SALT_BYTES = 16
        const val KEY_BITS = 256
    }
}
