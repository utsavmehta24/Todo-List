package com.utsavmehta.todolist.di

import com.utsavmehta.todolist.data.repository.AuthRepository
import com.utsavmehta.todolist.data.repository.AuthRepositoryImpl
import com.utsavmehta.todolist.data.repository.QuoteRepository
import com.utsavmehta.todolist.data.repository.QuoteRepositoryImpl
import com.utsavmehta.todolist.data.repository.ReviewRepository
import com.utsavmehta.todolist.data.repository.ReviewRepositoryImpl
import com.utsavmehta.todolist.data.repository.TaskRepository
import com.utsavmehta.todolist.data.repository.TaskRepositoryImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository

    @Binds
    @Singleton
    abstract fun bindTaskRepository(impl: TaskRepositoryImpl): TaskRepository

    @Binds
    @Singleton
    abstract fun bindReviewRepository(impl: ReviewRepositoryImpl): ReviewRepository

    @Binds
    @Singleton
    abstract fun bindQuoteRepository(impl: QuoteRepositoryImpl): QuoteRepository
}
