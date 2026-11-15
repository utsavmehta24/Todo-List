package com.utsavmehta.todolist.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "users", indices = [Index(value = ["email"], unique = true)])
data class UserEntity(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "id") val id: Long = 0,
    @ColumnInfo(name = "name") val name: String,
    /** Always stored via Validators.normalizeEmail(). */
    @ColumnInfo(name = "email") val email: String,
    /** PasswordHasher encoded string (includes salt). */
    @ColumnInfo(name = "password_hash") val passwordHash: String,
    @ColumnInfo(name = "created_at") val createdAt: Long,
)
