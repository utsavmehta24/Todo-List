package com.utsavmehta.todolist.domain.model

data class Task(
    val id: Long,
    val userId: Long,
    val title: String,
    val description: String,
    val status: TaskStatus,
    val addedDate: Long,
    val priority: Priority = Priority.MEDIUM,
    val energy: Energy = Energy.MEDIUM,
    val estimatedMinutes: Int = 25,
    val dueDate: Long? = null,
    val tags: String = "",
    val subtasks: String = "",
)
