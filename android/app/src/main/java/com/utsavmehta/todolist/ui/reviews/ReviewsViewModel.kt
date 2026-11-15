package com.utsavmehta.todolist.ui.reviews

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.ReviewRepository
import com.utsavmehta.todolist.domain.model.Review
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

data class ReviewsUiState(
    val reviews: List<Review> = emptyList(),
    val averageRating: Double = 0.0,
    val isLoading: Boolean = true,
)

@HiltViewModel
class ReviewsViewModel @Inject constructor(
    private val reviewRepository: ReviewRepository,
) : ViewModel() {

    val uiState: StateFlow<ReviewsUiState> = reviewRepository.observeReviews()
        .map { list ->
            ReviewsUiState(
                reviews = list,
                averageRating = if (list.isEmpty()) 0.0 else list.map { it.rating }.average(),
                isLoading = false,
            )
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), ReviewsUiState())
}
