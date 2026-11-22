package com.utsavmehta.todolist.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.utsavmehta.todolist.ui.theme.IndigoPrimary

@Composable
fun AboutDialog(onDismiss: () -> Unit) {
    val uriHandler = LocalUriHandler.current

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text(
                    text = "TaskFlow",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = IndigoPrimary,
                )
                Text(
                    text = "Built by Utsav",
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "TaskFlow is an Energy-Aware Flow Engine & Smart To-Do System engineered for high-stress creators, engineers, students, and neurodiverse (ADHD) professionals.",
                    style = MaterialTheme.typography.bodyMedium,
                )

                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = "✨ Superpowers",
                            style = MaterialTheme.typography.labelLarge,
                            fontWeight = FontWeight.Bold,
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = "• Natural Language Quick Add (#tag, !urgent, @energy, ~time)\n" +
                                "• \"What Now?\" Smart Recommender\n" +
                                "• Deep Work Pomodoro Focus Mode\n" +
                                "• Interactive Kanban & Subtasks Checklist\n" +
                                "• 100% Offline-First Persistence",
                            style = MaterialTheme.typography.bodySmall,
                        )
                    }
                }

                Text(
                    text = "Connect with Utsav:",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    OutlinedButton(
                        onClick = { uriHandler.openUri("https://github.com/utsavmehta24") },
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("GitHub", style = MaterialTheme.typography.labelMedium)
                    }
                    OutlinedButton(
                        onClick = { uriHandler.openUri("https://www.linkedin.com/in/utsav-mehta-462653258/") },
                        modifier = Modifier.weight(1f),
                    ) {
                        Text("LinkedIn", style = MaterialTheme.typography.labelMedium)
                    }
                }
            }
        },
        confirmButton = {
            Button(onClick = onDismiss) {
                Text("Got it")
            }
        },
    )
}
