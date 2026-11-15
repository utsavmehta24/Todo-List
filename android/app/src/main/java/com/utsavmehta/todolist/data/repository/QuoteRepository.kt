package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.domain.model.Quote
import kotlinx.coroutines.flow.Flow

interface QuoteRepository {
    suspend fun getQuotes(): List<Quote>
    fun rotatingQuotes(intervalMillis: Long): Flow<Quote>

    companion object {
        const val ROTATION_INTERVAL_MS = 5_000L
    }
}
