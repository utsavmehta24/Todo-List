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
                user = userDao.findByEmail(demoEmail)

                // Pre-seed sample tasks demonstrating TaskFlow superpowers
                val now = System.currentTimeMillis()
                val tomorrow = now + 86400000L
                taskDao.insert(
                    TaskEntity(
                        userId = newId,
                        title = "Ship release notes to users",
                        description = "Draft concise bullet points covering the new flow engine, NLP, and Pomodoro mode.",
                        status = "pending",
                        addedDate = now,
                        priority = "URGENT",
                        energy = "HIGH",
                        estimatedMinutes = 30,
                        dueDate = tomorrow,
                        tags = "dev, launch",
                        subtasks = "[ ] Review git commits; [ ] Write changelog; [ ] Post announcement",
                    )
                )
                taskDao.insert(
                    TaskEntity(
                        userId = newId,
                        title = "Reply to client emails",
                        description = "Quick status updates and feedback turnaround.",
                        status = "pending",
                        addedDate = now - 3600000L,
                        priority = "LOW",
                        energy = "QUICK_WIN",
                        estimatedMinutes = 15,
                        dueDate = now + 7200000L,
                        tags = "communication",
                        subtasks = "[ ] Inbox zero; [ ] Send calendar invites",
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
            }

            if (user != null) {
                sessionManager.startSession(user.id)
                AppResult.Success(user.toDomain())
            } else {
                AppResult.Error("Could not create demo session")
            }
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
