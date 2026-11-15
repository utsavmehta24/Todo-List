package com.utsavmehta.todolist.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "reviews",
    foreignKeys = [
        ForeignKey(
            entity = UserEntity::class,
            parentColumns = ["id"],
            childColumns = ["user_id"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index(value = ["user_id"]), Index(value = ["added_date"])],
)
data class ReviewEntity(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "id") val id: Long = 0,
    @ColumnInfo(name = "user_id") val userId: Long,
    /** 1..5, enforced in Validators. */
    @ColumnInfo(name = "rating") val rating: Int,
    @ColumnInfo(name = "description") val description: String,
    @ColumnInfo(name = "added_date") val addedDate: Long,
)
