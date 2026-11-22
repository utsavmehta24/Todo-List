package com.utsavmehta.todolist.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "tasks",
    foreignKeys = [
        ForeignKey(
            entity = UserEntity::class,
            parentColumns = ["id"],
            childColumns = ["user_id"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index(value = ["user_id"]), Index(value = ["user_id", "status"])],
)
data class TaskEntity(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "id") val id: Long = 0,
    @ColumnInfo(name = "user_id") val userId: Long,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "description") val description: String,
    @ColumnInfo(name = "status") val status: String,
    @ColumnInfo(name = "added_date") val addedDate: Long,
    @ColumnInfo(name = "priority", defaultValue = "MEDIUM") val priority: String = "MEDIUM",
    @ColumnInfo(name = "energy", defaultValue = "MEDIUM") val energy: String = "MEDIUM",
    @ColumnInfo(name = "estimated_minutes", defaultValue = "25") val estimatedMinutes: Int = 25,
    @ColumnInfo(name = "due_date") val dueDate: Long? = null,
    @ColumnInfo(name = "tags", defaultValue = "") val tags: String = "",
    @ColumnInfo(name = "subtasks", defaultValue = "") val subtasks: String = "",
)
