package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.data.local.dao.TaskDao
import com.utsavmehta.todolist.data.local.entity.TaskEntity
import com.utsavmehta.todolist.data.local.entity.toDomain
import com.utsavmehta.todolist.data.local.entity.toEntity
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStats
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.domain.validation.Validators
import javax.inject.Inject
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
        priority: Priority,
        energy: Energy,
        estimatedMinutes: Int,
        dueDate: Long?,
        tags: String,
        subtasks: String,
    ): AppResult<Task> {
        val titleError = Validators.validateTaskTitle(title)
        if (titleError != null) return AppResult.Error(titleError, FormField.TITLE)

        val descError = Validators.validateTaskDescription(description)
        if (descError != null) return AppResult.Error(descError, FormField.DESCRIPTION)

        val now = System.currentTimeMillis()
        val entity = TaskEntity(
            userId = userId,
            title = title.trim(),
            description = description.trim(),
            status = status.storageValue,
            addedDate = now,
            priority = priority.name,
            energy = energy.name,
            estimatedMinutes = estimatedMinutes,
            dueDate = dueDate,
            tags = tags.trim(),
            subtasks = subtasks.trim(),
        )

        val id = taskDao.insert(entity)
        return AppResult.Success(entity.copy(id = id).toDomain())
    }

    override suspend fun updateTask(task: Task): AppResult<Unit> {
        val rows = taskDao.update(task.toEntity())
        return if (rows > 0) AppResult.Success(Unit) else AppResult.Error("Task not found")
    }

    override suspend fun updateStatus(taskId: Long, userId: Long, status: TaskStatus): AppResult<Unit> {
        val rows = taskDao.updateStatus(taskId, userId, status.storageValue)
        return if (rows > 0) AppResult.Success(Unit) else AppResult.Error("Task not found")
    }

    override suspend fun deleteTask(taskId: Long, userId: Long): AppResult<Unit> {
        val rows = taskDao.delete(taskId, userId)
        return if (rows > 0) AppResult.Success(Unit) else AppResult.Error("Task not found")
    }
}
