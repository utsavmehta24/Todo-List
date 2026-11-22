package com.utsavmehta.todolist.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.utsavmehta.todolist.data.local.dao.ReviewDao
import com.utsavmehta.todolist.data.local.dao.TaskDao
import com.utsavmehta.todolist.data.local.dao.UserDao
import com.utsavmehta.todolist.data.local.entity.ReviewEntity
import com.utsavmehta.todolist.data.local.entity.TaskEntity
import com.utsavmehta.todolist.data.local.entity.UserEntity

@Database(
    entities = [UserEntity::class, TaskEntity::class, ReviewEntity::class],
    version = 2,
    exportSchema = false,
)
abstract class TodoDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun taskDao(): TaskDao
    abstract fun reviewDao(): ReviewDao

    companion object {
        const val NAME = "todo.db"
    }
}
