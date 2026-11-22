package com.utsavmehta.todolist.di

import android.content.Context
import androidx.room.Room
import com.utsavmehta.todolist.data.local.TodoDatabase
import com.utsavmehta.todolist.data.local.dao.ReviewDao
import com.utsavmehta.todolist.data.local.dao.TaskDao
import com.utsavmehta.todolist.data.local.dao.UserDao
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): TodoDatabase =
        Room.databaseBuilder(context, TodoDatabase::class.java, TodoDatabase.NAME)
            .fallbackToDestructiveMigration()
            .build()

    @Provides
    fun provideUserDao(db: TodoDatabase): UserDao = db.userDao()

    @Provides
    fun provideTaskDao(db: TodoDatabase): TaskDao = db.taskDao()

    @Provides
    fun provideReviewDao(db: TodoDatabase): ReviewDao = db.reviewDao()
}
