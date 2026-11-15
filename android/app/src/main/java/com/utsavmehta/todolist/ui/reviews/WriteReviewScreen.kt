package com.utsavmehta.todolist.ui.reviews

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.utsavmehta.todolist.ui.components.FormTextField
import com.utsavmehta.todolist.ui.components.LoadingButton
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState

/**
 * Form for submitting a review. Requires a logged-in user (the scaffold guards this route).
 * Calls [onReviewSubmitted] after a successful save so the scaffold can pop back and confirm.
 */
@Composable
fun WriteReviewScreen(
    onReviewSubmitted: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: WriteReviewViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = LocalSnackbarHostState.current

    LaunchedEffect(state.submitted) {
        if (state.submitted) {
            onReviewSubmitted()
            viewModel.onSubmittedHandled()
        }
    }

    LaunchedEffect(state.userMessage) {
        state.userMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.onUserMessageShown()
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            text = "Your rating",
            style = MaterialTheme.typography.titleMedium,
        )
        StarRating(
            rating = state.rating,
            starSize = 40.dp,
            onRatingChange = viewModel::onRatingChange,
        )
        state.ratingError?.let { message ->
            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.error,
            )
        }
        FormTextField(
            value = state.description,
            onValueChange = viewModel::onDescriptionChange,
            label = "Description",
            singleLine = false,
            minLines = 4,
            error = state.descriptionError,
            imeAction = ImeAction.Done,
        )
        LoadingButton(
            text = "Submit review",
            onClick = viewModel::onSubmit,
            isLoading = state.isSubmitting,
        )
    }
}
