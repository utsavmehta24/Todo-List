package com.utsavmehta.todolist.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.recommender.Recommender
import com.utsavmehta.todolist.ui.theme.IndigoPrimary

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RecommenderDialog(
    tasks: List<Task>,
    onDismiss: () -> Unit,
    onStartFocus: (Task) -> Unit,
) {
    var selectedEnergy by remember { mutableStateOf(Energy.MEDIUM) }
    var selectedMinutes by remember { mutableIntStateOf(30) }

    val recommendation = remember(tasks, selectedEnergy, selectedMinutes) {
        Recommender.recommendNext(tasks, selectedEnergy, selectedMinutes)
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = "⚡ What Should I Do Right Now?",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = "Tell TaskFlow how you feel right now. The engine calculates urgency, energy match, and time availability:",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )

                Text(
                    text = "Current Energy:",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                )
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp),
                ) {
                    Energy.entries.forEach { energy ->
                        FilterChip(
                            selected = selectedEnergy == energy,
                            onClick = { selectedEnergy = energy },
                            label = { Text("${energy.emoji} ${energy.label}") },
                        )
                    }
                }

                Text(
                    text = "Available Time:",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf(15 to "15m", 30 to "30m", 60 to "60m").forEach { (mins, label) ->
                        FilterChip(
                            selected = selectedMinutes == mins,
                            onClick = { selectedMinutes = mins },
                            label = { Text(label) },
                        )
                    }
                }

                Spacer(Modifier.height(4.dp))

                if (recommendation != null) {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Text(
                                    text = "RECOMMENDED ACTION",
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = IndigoPrimary,
                                )
                                Text(
                                    text = "Score: ${recommendation.score}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                            Spacer(Modifier.height(6.dp))
                            Text(
                                text = recommendation.task.title,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                            )
                            if (recommendation.task.description.isNotBlank()) {
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    text = recommendation.task.description,
                                    style = MaterialTheme.typography.bodySmall,
                                    maxLines = 2,
                                )
                            }
                            Spacer(Modifier.height(8.dp))
                            Text(
                                text = "💡 ${recommendation.reason}",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                            )
                        }
                    }
                } else {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Text(
                                text = "🎉 You're all caught up!",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                            )
                            Text(
                                text = "No open tasks match this criteria. Add a new task or take a rest.",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            if (recommendation != null) {
                Button(
                    onClick = {
                        onDismiss()
                        onStartFocus(recommendation.task)
                    },
                ) {
                    Text("Start Focus on This")
                }
            } else {
                Button(onClick = onDismiss) {
                    Text("Close")
                }
            }
        },
        dismissButton = {
            if (recommendation != null) {
                TextButton(onClick = onDismiss) {
                    Text("Cancel")
                }
            }
        },
    )
}
