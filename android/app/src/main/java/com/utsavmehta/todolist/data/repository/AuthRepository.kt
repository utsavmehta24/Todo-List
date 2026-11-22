package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.User
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    val currentUser: Flow<User?>
    suspend fun signUp(name: String, email: String, password: String): AppResult<User>
    suspend fun login(email: String, password: String): AppResult<User>
    suspend fun quickDemoLogin(): AppResult<User>
    suspend fun logout()
}
