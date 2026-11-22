package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStats
import com.utsavmehta.todolist.domain.model.TaskStatus
import kotlinx.coroutines.flow.Flow

interface TaskRepository {
    fun observeTasks(userId: Long): Flow<List<Task>>
    fun observeTaskStats(userId: Long): Flow<TaskStats>
    suspend fun addTask(
        userId: Long,
        title: String,
        description: String,
        status: TaskStatus = TaskStatus.PENDING,
        priority: Priority = Priority.MEDIUM,
        energy: Energy = Energy.MEDIUM,
        estimatedMinutes: Int = 25,
        dueDate: Long? = null,
        tags: String = "",
        subtasks: String = "",
    ): AppResult<Task>
    suspend fun updateTask(task: Task): AppResult<Unit>
    suspend fun updateStatus(taskId: Long, userId: Long, status: TaskStatus): AppResult<Unit>
    suspend fun deleteTask(taskId: Long, userId: Long): AppResult<Unit>
}
