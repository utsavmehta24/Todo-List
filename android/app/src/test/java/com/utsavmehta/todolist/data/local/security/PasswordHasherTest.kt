package com.utsavmehta.todolist.data.local.security

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class PasswordHasherTest {

    private val hasher = PasswordHasher()

    @Test
    fun hash_isNotPlaintext_andUsesExpectedFormat() {
        val password = "correct-horse"
        val hash = hasher.hash(password)

        assertNotEquals(password, hash)
        assertTrue(hash.startsWith("pbkdf2_sha256\$120000\$"))
    }

    @Test
    fun verify_returnsTrue_forSamePassword() {
        val hash = hasher.hash("secret123")

        assertTrue(hasher.verify("secret123", hash))
    }

    @Test
    fun verify_returnsFalse_forWrongPassword() {
        val hash = hasher.hash("secret123")

        assertFalse(hasher.verify("secret124", hash))
    }

    @Test
    fun verify_returnsFalse_withoutThrowing_forMalformedInput() {
        val malformed = listOf(
            "",
            "garbage",
            "pbkdf2_sha256\$abc\$x\$y",
            "pbkdf2_sha256\$120000\$!!!\$???",
            "other\$120000\$AAAA\$AAAA",
            "pbkdf2_sha256\$120000\$AAAA",
            "pbkdf2_sha256\$120000\$AAAA\$AAAA\$AAAA",
        )

        malformed.forEach { encoded ->
            assertFalse("Expected false for: $encoded", hasher.verify("secret123", encoded))
        }
    }

    @Test
    fun hash_differsBetweenCalls_butBothVerify() {
        val first = hasher.hash("secret123")
        val second = hasher.hash("secret123")

        assertNotEquals(first, second)
        assertTrue(hasher.verify("secret123", first))
        assertTrue(hasher.verify("secret123", second))
        assertEquals(first.split("\$").size, second.split("\$").size)
    }
}
