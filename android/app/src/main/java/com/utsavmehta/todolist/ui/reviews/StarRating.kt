package com.utsavmehta.todolist.ui.reviews

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.utsavmehta.todolist.ui.theme.StarEmpty
import com.utsavmehta.todolist.ui.theme.StarGold

/**
 * Renders five stars with the first [rating] stars filled.
 *
 * When [onRatingChange] is non-null each star is tappable and reports its 1-based index.
 * When it is null the control is read-only and the row is announced as "N out of 5 stars".
 */
@Composable
fun StarRating(
    rating: Int,
    modifier: Modifier = Modifier,
    onRatingChange: ((Int) -> Unit)? = null,
    starSize: Dp = 24.dp,
) {
    Row(
        modifier = modifier.semantics { contentDescription = "$rating out of 5 stars" },
    ) {
        for (index in 1..5) {
            val tint = if (index <= rating) StarGold else StarEmpty
            if (onRatingChange != null) {
                Icon(
                    imageVector = Icons.Filled.Star,
                    contentDescription = if (index == 1) "1 star" else "$index stars",
                    tint = tint,
                    modifier = Modifier
                        .size(starSize)
                        .clickable { onRatingChange(index) },
                )
            } else {
                Icon(
                    imageVector = Icons.Filled.Star,
                    contentDescription = null,
                    tint = tint,
                    modifier = Modifier.size(starSize),
                )
            }
        }
    }
}
