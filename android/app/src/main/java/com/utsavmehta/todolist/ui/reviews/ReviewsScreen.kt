package com.utsavmehta.todolist.ui.reviews

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.utsavmehta.todolist.ui.components.EmptyState
import com.utsavmehta.todolist.ui.components.FullScreenLoading
import java.util.Locale
import kotlin.math.roundToInt

/**
 * Public reviews list: average rating header, write-review action, then every review.
 * The write action is always shown; logged-out users see a hint and are sent to Login by the scaffold.
 */
@Composable
fun ReviewsScreen(
    isLoggedIn: Boolean,
    onWriteReview: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ReviewsViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    if (state.isLoading) {
        FullScreenLoading(modifier = modifier)
    } else {
        LazyColumn(
            modifier = modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item(key = "summary") {
                ReviewsSummary(
                    averageRating = state.averageRating,
                    count = state.reviews.size,
                )
            }
            item(key = "write-action") {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Button(
                        onClick = onWriteReview,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Text("Write a review")
                    }
                    if (!isLoggedIn) {
                        Text(
                            text = "Log in to write a review",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
            if (state.reviews.isEmpty()) {
                item(key = "empty") {
                    EmptyState(
                        title = "No reviews yet",
                        message = "Be the first to share your experience.",
                    )
                }
            } else {
                items(items = state.reviews, key = { review -> review.id }) { review ->
                    ReviewCard(review = review)
                }
            }
        }
    }
}

@Composable
private fun ReviewsSummary(averageRating: Double, count: Int) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(
            text = String.format(Locale.getDefault(), "%.1f", averageRating),
            style = MaterialTheme.typography.displaySmall,
            fontWeight = FontWeight.Bold,
        )
        StarRating(rating = averageRating.roundToInt())
        Text(
            text = if (count == 1) "1 review" else "$count reviews",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
