package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.data.local.dao.TaskDao
import com.utsavmehta.todolist.data.local.entity.TaskEntity
import com.utsavmehta.todolist.data.local.entity.toDomain
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStats
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.domain.validation.ValidationMessages
import com.utsavmehta.todolist.domain.validation.Validators
import javax.inject.Inject
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class TaskRepositoryImpl @Inject constructor(
    private val taskDao: TaskDao,
) : TaskRepository {

    override fun observeTasks(userId: Long): Flow<List<Task>> =
        taskDao.observeForUser(userId).map { list -> list.map { it.toDomain() } }

    override fun observeTaskStats(userId: Long): Flow<TaskStats> =
        taskDao.observeStats(userId).map { it.toDomain() }

    override suspend fun addTask(
        userId: Long,
        title: String,
        description: String,
        status: TaskStatus,
    ): AppResult<Task> {
        Validators.validateTaskTitle(title)?.let { message ->
            return AppResult.Error(message, FormField.TITLE)
        }
        Validators.validateTaskDescription(description)?.let { message ->
            return AppResult.Error(message, FormField.DESCRIPTION)
        }
        val cleanTitle = title.trim()
        val cleanDescription = description.trim()
        return try {
            val now = System.currentTimeMillis()
            val generatedId = taskDao.insert(
                TaskEntity(
                    userId = userId,
                    title = cleanTitle,
                    description = cleanDescription,
                    status = status.storageValue,
                    addedDate = now,
                ),
            )
            AppResult.Success(
                Task(
                    id = generatedId,
                    userId = userId,
                    title = cleanTitle,
                    description = cleanDescription,
                    status = status,
                    addedDate = now,
                ),
            )
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            AppResult.Error(ValidationMessages.GENERIC)
        }
    }

    override suspend fun updateStatus(
        taskId: Long,
        userId: Long,
        status: TaskStatus,
    ): AppResult<Unit> = try {
        val rows = taskDao.updateStatus(taskId, userId, status.storageValue)
        if (rows == 0) {
            AppResult.Error(ValidationMessages.TASK_NOT_FOUND)
        } else {
            AppResult.Success(Unit)
        }
    } catch (e: CancellationException) {
        throw e
    } catch (e: Exception) {
        AppResult.Error(ValidationMessages.GENERIC)
    }

    override suspend fun deleteTask(taskId: Long, userId: Long): AppResult<Unit> = try {
        val rows = taskDao.delete(taskId, userId)
        if (rows == 0) {
            AppResult.Error(ValidationMessages.TASK_NOT_FOUND)
        } else {
            AppResult.Success(Unit)
        }
    } catch (e: CancellationException) {
        throw e
    } catch (e: Exception) {
        AppResult.Error(ValidationMessages.GENERIC)
    }
}
