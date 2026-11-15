package com.utsavmehta.todolist.ui.reviews

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.AuthRepository
import com.utsavmehta.todolist.data.repository.ReviewRepository
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.validation.ValidationMessages
import com.utsavmehta.todolist.domain.validation.Validators
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class WriteReviewUiState(
    val rating: Int = 0,
    val description: String = "",
    val ratingError: String? = null,
    val descriptionError: String? = null,
    val isSubmitting: Boolean = false,
    val submitted: Boolean = false,
    val userMessage: String? = null,
)

@HiltViewModel
class WriteReviewViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val reviewRepository: ReviewRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(WriteReviewUiState())
    val uiState: StateFlow<WriteReviewUiState> = _uiState.asStateFlow()

    fun onRatingChange(rating: Int) {
        _uiState.update { it.copy(rating = rating, ratingError = null) }
    }

    fun onDescriptionChange(value: String) {
        _uiState.update { it.copy(description = value, descriptionError = null) }
    }

    fun onSubmit() {
        val current = _uiState.value
        if (current.isSubmitting) return

        val rating = current.rating
        val description = current.description
        val ratingError = Validators.validateRating(rating)
        val descriptionError = Validators.validateReviewDescription(description)
        if (ratingError != null || descriptionError != null) {
            _uiState.update {
                it.copy(ratingError = ratingError, descriptionError = descriptionError)
            }
            return
        }

        _uiState.update {
            it.copy(isSubmitting = true, ratingError = null, descriptionError = null)
        }

        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            if (user == null) {
                _uiState.update {
                    it.copy(isSubmitting = false, userMessage = ValidationMessages.NOT_LOGGED_IN)
                }
                return@launch
            }

            when (val result = reviewRepository.addReview(user.id, rating, description)) {
                is AppResult.Success -> _uiState.update {
                    it.copy(isSubmitting = false, submitted = true)
                }
                is AppResult.Error -> _uiState.update {
                    when (result.field) {
                        FormField.RATING -> it.copy(isSubmitting = false, ratingError = result.message)
                        FormField.DESCRIPTION -> it.copy(isSubmitting = false, descriptionError = result.message)
                        else -> it.copy(isSubmitting = false, userMessage = result.message)
                    }
                }
            }
        }
    }

    fun onSubmittedHandled() {
        _uiState.update { it.copy(submitted = false) }
    }

    fun onUserMessageShown() {
        _uiState.update { it.copy(userMessage = null) }
    }
}
