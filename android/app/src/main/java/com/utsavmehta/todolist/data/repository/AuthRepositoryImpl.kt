package com.utsavmehta.todolist.data.repository

import android.database.sqlite.SQLiteConstraintException
import com.utsavmehta.todolist.data.local.dao.UserDao
import com.utsavmehta.todolist.data.local.entity.UserEntity
import com.utsavmehta.todolist.data.local.entity.toDomain
import com.utsavmehta.todolist.data.local.security.PasswordHasher
import com.utsavmehta.todolist.data.local.session.SessionManager
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.model.User
import com.utsavmehta.todolist.domain.validation.ValidationMessages
import com.utsavmehta.todolist.domain.validation.Validators
import javax.inject.Inject
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

@OptIn(ExperimentalCoroutinesApi::class)
class AuthRepositoryImpl @Inject constructor(
    private val userDao: UserDao,
    private val sessionManager: SessionManager,
    private val passwordHasher: PasswordHasher,
) : AuthRepository {

    override val currentUser: Flow<User?> = sessionManager.currentUserId
        .flatMapLatest { id ->
            if (id == null) {
                flowOf<User?>(null)
            } else {
                userDao.observeById(id).map { it?.toDomain() }
            }
        }
        .distinctUntilChanged()

    override suspend fun signUp(name: String, email: String, password: String): AppResult<User> {
        return try {
            Validators.validateName(name)?.let { return AppResult.Error(it, FormField.NAME) }
            Validators.validateEmail(email)?.let { return AppResult.Error(it, FormField.EMAIL) }
            Validators.validateNewPassword(password)?.let { return AppResult.Error(it, FormField.PASSWORD) }

            val normalizedEmail = Validators.normalizeEmail(email)
            if (userDao.emailExists(normalizedEmail)) {
                return AppResult.Error(ValidationMessages.EMAIL_TAKEN, FormField.EMAIL)
            }

            val trimmedName = name.trim()
            val hash = withContext(Dispatchers.Default) { passwordHasher.hash(password) }

            val insertedId = try {
                userDao.insert(
                    UserEntity(
                        name = trimmedName,
                        email = normalizedEmail,
                        passwordHash = hash,
                        createdAt = System.currentTimeMillis(),
                    ),
                )
            } catch (e: SQLiteConstraintException) {
                return AppResult.Error(ValidationMessages.EMAIL_TAKEN, FormField.EMAIL)
            }

            AppResult.Success(User(id = insertedId, name = trimmedName, email = normalizedEmail))
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            AppResult.Error(ValidationMessages.GENERIC)
        }
    }

    override suspend fun login(email: String, password: String): AppResult<User> {
        return try {
            Validators.validateEmail(email)?.let { return AppResult.Error(it, FormField.EMAIL) }
            Validators.validateLoginPassword(password)?.let { return AppResult.Error(it, FormField.PASSWORD) }

            val entity = userDao.findByEmail(Validators.normalizeEmail(email))
            // Same message for unknown email and wrong password: no user enumeration.
            if (entity == null ||
                !withContext(Dispatchers.Default) { passwordHasher.verify(password, entity.passwordHash) }
            ) {
                return AppResult.Error(ValidationMessages.INVALID_CREDENTIALS)
            }

            sessionManager.startSession(entity.id)
            AppResult.Success(entity.toDomain())
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            AppResult.Error(ValidationMessages.GENERIC)
        }
    }

    override suspend fun logout() {
        try {
            sessionManager.clearSession()
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            // Logout has no error channel; a failed clear leaves the session in place and the next call retries.
        }
    }
}
