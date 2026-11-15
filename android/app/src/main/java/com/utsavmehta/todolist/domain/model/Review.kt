package com.utsavmehta.todolist.domain.model

data class Review(
    val id: Long,
    val userId: Long,
    val authorName: String,
    val rating: Int,
    val description: String,
    val addedDate: Long,
)
