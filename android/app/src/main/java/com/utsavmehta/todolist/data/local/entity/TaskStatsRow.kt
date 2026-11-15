package com.utsavmehta.todolist.data.local.entity

import androidx.room.ColumnInfo

data class TaskStatsRow(
    @ColumnInfo(name = "total") val total: Int,
    @ColumnInfo(name = "pending") val pending: Int,
    @ColumnInfo(name = "completed") val completed: Int,
)
