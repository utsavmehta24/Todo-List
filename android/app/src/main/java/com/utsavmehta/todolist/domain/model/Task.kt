package com.utsavmehta.todolist.domain.model

data class Task(
    val id: Long,
    val userId: Long,
    val title: String,
    val description: String,
    val status: TaskStatus,
    val addedDate: Long,
)
