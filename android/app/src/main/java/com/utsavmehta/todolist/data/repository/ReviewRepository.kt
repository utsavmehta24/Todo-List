package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.Review
import kotlinx.coroutines.flow.Flow

interface ReviewRepository {
    fun observeReviews(): Flow<List<Review>>
    suspend fun addReview(userId: Long, rating: Int, description: String): AppResult<Review>
}
