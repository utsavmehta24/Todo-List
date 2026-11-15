package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStats
import com.utsavmehta.todolist.domain.model.TaskStatus
import kotlinx.coroutines.flow.Flow

interface TaskRepository {
    fun observeTasks(userId: Long): Flow<List<Task>>
    fun observeTaskStats(userId: Long): Flow<TaskStats>
    suspend fun addTask(userId: Long, title: String, description: String, status: TaskStatus): AppResult<Task>
    suspend fun updateStatus(taskId: Long, userId: Long, status: TaskStatus): AppResult<Unit>
    suspend fun deleteTask(taskId: Long, userId: Long): AppResult<Unit>
}
