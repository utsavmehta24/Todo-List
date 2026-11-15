package com.utsavmehta.todolist.data.repository

import com.utsavmehta.todolist.data.local.dao.ReviewDao
import com.utsavmehta.todolist.data.local.entity.ReviewEntity
import com.utsavmehta.todolist.data.local.entity.toDomain
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.model.Review
import com.utsavmehta.todolist.domain.validation.ValidationMessages
import com.utsavmehta.todolist.domain.validation.Validators
import javax.inject.Inject
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class ReviewRepositoryImpl @Inject constructor(
    private val reviewDao: ReviewDao,
) : ReviewRepository {

    override fun observeReviews(): Flow<List<Review>> =
        reviewDao.observeAllWithAuthor().map { rows -> rows.map { it.toDomain() } }

    override suspend fun addReview(userId: Long, rating: Int, description: String): AppResult<Review> {
        return try {
            Validators.validateRating(rating)?.let { message ->
                return AppResult.Error(message, FormField.RATING)
            }
            Validators.validateReviewDescription(description)?.let { message ->
                return AppResult.Error(message, FormField.DESCRIPTION)
            }
            val trimmed = description.trim()
            val now = System.currentTimeMillis()
            val generatedId = reviewDao.insert(
                ReviewEntity(
                    userId = userId,
                    rating = rating,
                    description = trimmed,
                    addedDate = now,
                ),
            )
            AppResult.Success(
                Review(
                    id = generatedId,
                    userId = userId,
                    authorName = "",
                    rating = rating,
                    description = trimmed,
                    addedDate = now,
                ),
            )
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            AppResult.Error(ValidationMessages.GENERIC)
        }
    }
}
