package com.utsavmehta.todolist.data.repository

import android.database.sqlite.SQLiteConstraintException
import com.utsavmehta.todolist.data.local.dao.TaskDao
import com.utsavmehta.todolist.data.local.dao.UserDao
import com.utsavmehta.todolist.data.local.entity.TaskEntity
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
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext

@OptIn(ExperimentalCoroutinesApi::class)
class AuthRepositoryImpl @Inject constructor(
    private val userDao: UserDao,
    private val taskDao: TaskDao,
    private val sessionManager: SessionManager,
    private val passwordHasher: PasswordHasher,
) : AuthRepository {

    private suspend fun ensureDefaultUser(): User {
        val demoEmail = "demo@taskflow.dev"
        var user = userDao.findByEmail(demoEmail)
        if (user == null) {
            val hash = withContext(Dispatchers.Default) { passwordHasher.hash("demo1234") }
            val newId = userDao.insert(
                UserEntity(
                    name = "Utsav Mehta",
                    email = demoEmail,
                    passwordHash = hash,
                    createdAt = System.currentTimeMillis(),
                )
            )
            val now = System.currentTimeMillis()
            val tomorrow = now + 86400000L
            taskDao.insert(
                TaskEntity(
                    userId = newId,
                    title = "Deploy TaskFlow Android Release",
                    description = "Verify Jetpack Compose Material 3 screens, NLP quick-add, and Pomodoro mode.",
                    status = "pending",
                    addedDate = now,
                    priority = "URGENT",
                    energy = "HIGH",
                    estimatedMinutes = 30,
                    dueDate = tomorrow,
                    tags = "dev, launch",
                    subtasks = "[ ] Review git commits; [ ] Test on Android; [ ] Post announcement",
                )
            )
            taskDao.insert(
                TaskEntity(
                    userId = newId,
                    title = "Reply to team messages & sync",
                    description = "Quick status updates and feedback turnaround.",
                    status = "pending",
                    addedDate = now - 3600000L,
                    priority = "LOW",
                    energy = "QUICK_WIN",
                    estimatedMinutes = 15,
                    dueDate = now + 7200000L,
                    tags = "communication",
                    subtasks = "[ ] Inbox zero; [ ] Check Slack",
                )
            )
            taskDao.insert(
                TaskEntity(
                    userId = newId,
                    title = "Refactor NLP parser tokenizer",
                    description = "Support flexible duration syntax (~45m, ~1.5h) and priority flags.",
                    status = "in_progress",
                    addedDate = now - 7200000L,
                    priority = "HIGH",
                    energy = "HIGH",
                    estimatedMinutes = 45,
                    dueDate = tomorrow,
                    tags = "architecture",
                    subtasks = "[x] Regex test suite; [ ] Android Compose parser",
                )
            )
            user = userDao.findByEmail(demoEmail)
        }
        val finalUser = user ?: UserEntity(id = 1L, name = "Utsav Mehta", email = demoEmail, passwordHash = "", createdAt = 0L)
        sessionManager.startSession(finalUser.id)
        return finalUser.toDomain()
    }

    override val currentUser: Flow<User?> = sessionManager.currentUserId
        .flatMapLatest { id ->
            if (id == null) {
                flow {
                    val defaultUser = ensureDefaultUser()
                    emit(defaultUser)
                }
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
            val verified = withContext(Dispatchers.Default) {
                if (entity == null) {
                    passwordHasher.dummyVerify(password)
                    false
                } else {
                    passwordHasher.verify(password, entity.passwordHash)
                }
            }
            if (entity == null || !verified) {
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

    override suspend fun quickDemoLogin(): AppResult<User> {
        return try {
            val user = ensureDefaultUser()
            AppResult.Success(user)
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
        }
    }
}
