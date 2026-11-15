package com.utsavmehta.todolist.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Card
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.platform.UriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

private data class Feature(
    val title: String,
    val description: String,
    val icon: ImageVector,
    val url: String,
)

private val features = listOf(
    Feature(
        title = "Improved Health",
        description = "Managing your time effectively reduces stress and prevents burnout, leading to better mental and physical health.",
        icon = Icons.Filled.CheckCircle,
        url = "https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work",
    ),
    Feature(
        title = "Increased Productivity",
        description = "Effective time management allows you to focus on what matters most, boosting your productivity and achieving your goals.",
        icon = Icons.Filled.Refresh,
        url = "https://community.thriveglobal.com/boosting-your-productivity-with-simple-powerful-tools-improving-your-workflow-with-automation/",
    ),
    Feature(
        title = "Achieve Goals",
        description = "By organizing your time well, you set clear priorities and goals, making it easier to track progress and achieve desired outcomes.",
        icon = Icons.Filled.Star,
        url = "https://hbr.org/2022/08/5-ways-to-set-more-achievable-goals",
    ),
    Feature(
        title = "Better Work-Life Balance",
        description = "Good time management helps you balance work and personal life, leading to improved relationships and overall satisfaction.",
        icon = Icons.Filled.Home,
        url = "https://health.economictimes.indiatimes.com/news/industry/work-life-balance-a-deep-mental-health-crisis-looms/114935368",
    ),
    Feature(
        title = "Career Growth",
        description = "Effective time management helps you stay organized and focused, which can lead to better career advancement opportunities.",
        icon = Icons.Filled.Person,
        url = "https://vati.io/career-guide/accelerating-your-career-growth-strategies-and-techniques-for-advancement/",
    ),
)

/**
 * Section listing the benefits of time management, each with a "Learn more" link
 * that opens in an external browser.
 */
@Composable
fun FeatureHighlights(modifier: Modifier = Modifier) {
    val uriHandler = LocalUriHandler.current

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            text = "Benefits of Time Management",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
        )
        Text(
            text = "Effective time management can greatly enhance your life and health. Here are some key benefits:",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
        features.forEach { feature ->
            FeatureCard(
                feature = feature,
                onLearnMore = { openUrl(uriHandler, feature.url) },
            )
        }
    }
}

@Composable
private fun FeatureCard(
    feature: Feature,
    onLearnMore: () -> Unit,
) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .background(MaterialTheme.colorScheme.primaryContainer, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        imageVector = feature.icon,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    )
                }
                Text(
                    text = feature.title,
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.weight(1f),
                )
            }
            Text(
                text = feature.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            TextButton(onClick = onLearnMore) {
                Text("Learn more")
            }
        }
    }
}

/** Opens [url] in a browser; a device without a browser must not crash the screen. */
private fun openUrl(uriHandler: UriHandler, url: String) {
    try {
        uriHandler.openUri(url)
    } catch (e: Exception) {
        // No application can handle the link; nothing else to do.
    }
}
