package com.utsavmehta.todolist.data.local.entity

import androidx.room.ColumnInfo

data class ReviewWithAuthorRow(
    @ColumnInfo(name = "id") val id: Long,
    @ColumnInfo(name = "user_id") val userId: Long,
    @ColumnInfo(name = "author_name") val authorName: String,
    @ColumnInfo(name = "rating") val rating: Int,
    @ColumnInfo(name = "description") val description: String,
    @ColumnInfo(name = "added_date") val addedDate: Long,
)
