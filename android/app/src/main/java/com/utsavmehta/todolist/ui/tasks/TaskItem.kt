package com.utsavmehta.todolist.ui.tasks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.ui.components.formatDate
import com.utsavmehta.todolist.ui.theme.EnergyHigh
import com.utsavmehta.todolist.ui.theme.EnergyLow
import com.utsavmehta.todolist.ui.theme.EnergyMedium
import com.utsavmehta.todolist.ui.theme.EnergyQuickWin
import com.utsavmehta.todolist.ui.theme.IndigoPrimary
import com.utsavmehta.todolist.ui.theme.PriorityHigh
import com.utsavmehta.todolist.ui.theme.PriorityLow
import com.utsavmehta.todolist.ui.theme.PriorityMedium
import com.utsavmehta.todolist.ui.theme.PriorityUrgent

data class SubtaskItem(val id: Int, val title: String, val completed: Boolean)

fun parseSubtasks(raw: String): List<SubtaskItem> {
    if (raw.isBlank()) return emptyList()
    return raw.split(";").mapIndexedNotNull { index, item ->
        val trimmed = item.trim()
        if (trimmed.isBlank()) null
        else {
            val isChecked = trimmed.startsWith("[x]", ignoreCase = true)
            val clean = trimmed.removePrefix("[x]").removePrefix("[X]").removePrefix("[ ]").trim()
            SubtaskItem(index, clean, isChecked)
        }
    }
}

fun serializeSubtasks(items: List<SubtaskItem>): String {
    return items.joinToString("; ") { item ->
        if (item.completed) "[x] ${item.title}" else "[ ] ${item.title}"
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TaskItem(
    task: Task,
    onToggleStatus: () -> Unit,
    onDelete: () -> Unit,
    onStartFocus: () -> Unit,
    onUpdateTask: (Task) -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val isCompleted = task.status == TaskStatus.COMPLETED
    val priorityColor = when (task.priority) {
        Priority.URGENT -> PriorityUrgent
        Priority.HIGH -> PriorityHigh
        Priority.MEDIUM -> PriorityMedium
        Priority.LOW -> PriorityLow
    }

    val energyColor = when (task.energy) {
        Energy.QUICK_WIN -> EnergyQuickWin
        Energy.LOW -> EnergyLow
        Energy.MEDIUM -> EnergyMedium
        Energy.HIGH -> EnergyHigh
    }

    val subtasks = remember(task.subtasks) { parseSubtasks(task.subtasks) }
    var showSubtasks by remember { mutableStateOf(subtasks.isNotEmpty()) }

    Card(
        modifier = modifier
            .fillMaxWidth()
            .border(
                width = 1.dp,
                color = if (isCompleted) MaterialTheme.colorScheme.outline.copy(alpha = 0.2f) else priorityColor.copy(alpha = 0.35f),
                shape = RoundedCornerShape(16.dp),
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isCompleted) MaterialTheme.colorScheme.surface.copy(alpha = 0.7f) else MaterialTheme.colorScheme.surface,
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = if (isCompleted) 0.dp else 2.dp),
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            // Left Priority Indicator Bar
            Box(
                modifier = Modifier
                    .width(6.dp)
                    .height(if (subtasks.isNotEmpty()) 180.dp else 130.dp)
                    .background(if (isCompleted) MaterialTheme.colorScheme.outline.copy(alpha = 0.4f) else priorityColor)
            )

            Column(modifier = Modifier.padding(14.dp).weight(1f)) {
                // Header: Title + Checkbox + Delete
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Checkbox(
                        checked = isCompleted,
                        onCheckedChange = { onToggleStatus() },
                    )

                    Spacer(Modifier.width(8.dp))

                    Text(
                        text = task.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = if (isCompleted) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
                        textDecoration = if (isCompleted) TextDecoration.LineThrough else null,
                        modifier = Modifier.weight(1f),
                    )

                    IconButton(onClick = onDelete) {
                        Icon(
                            imageVector = Icons.Filled.Delete,
                            contentDescription = "Delete task",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                        )
                    }
                }

                // Description
                if (task.description.isNotBlank()) {
                    Spacer(Modifier.height(4.dp))
                    Text(
                        text = task.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis,
                    )
                }

                // Badges Row
                Spacer(Modifier.height(8.dp))
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    // Priority Badge
                    BadgeChip(label = "!${task.priority.label}", color = priorityColor)

                    // Energy Badge
                    BadgeChip(label = "${task.energy.emoji} ${task.energy.label}", color = energyColor)

                    // Estimated Time Badge
                    BadgeChip(label = "~${task.estimatedMinutes}m", color = MaterialTheme.colorScheme.secondary)

                    // Tags
                    if (task.tags.isNotBlank()) {
                        task.tags.split(",").map { it.trim() }.filter { it.isNotBlank() }.forEach { tag ->
                            BadgeChip(label = "#$tag", color = IndigoPrimary)
                        }
                    }

                    // Added Date
                    Text(
                        text = "Added ${formatDate(task.addedDate)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f),
                        modifier = Modifier.align(Alignment.CenterVertically).padding(start = 4.dp),
                    )
                }

                // Subtasks checklist (if any)
                if (subtasks.isNotEmpty()) {
                    Spacer(Modifier.height(8.dp))
                    val completedCount = subtasks.count { it.completed }
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth().clickable { showSubtasks = !showSubtasks },
                    ) {
                        Text(
                            text = "Checklist ($completedCount/${subtasks.size})",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = IndigoPrimary,
                        )
                        Text(
                            text = if (showSubtasks) "Hide" else "Show",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }

                    AnimatedVisibility(visible = showSubtasks) {
                        Column(modifier = Modifier.padding(top = 4.dp)) {
                            subtasks.forEachIndexed { idx, sub ->
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.fillMaxWidth().clickable {
                                        val updatedList = subtasks.toMutableList()
                                        updatedList[idx] = sub.copy(completed = !sub.completed)
                                        val newSubtasksStr = serializeSubtasks(updatedList)
                                        onUpdateTask(task.copy(subtasks = newSubtasksStr))
                                    },
                                ) {
                                    Checkbox(
                                        checked = sub.completed,
                                        onCheckedChange = { isChecked ->
                                            val updatedList = subtasks.toMutableList()
                                            updatedList[idx] = sub.copy(completed = isChecked)
                                            val newSubtasksStr = serializeSubtasks(updatedList)
                                            onUpdateTask(task.copy(subtasks = newSubtasksStr))
                                        },
                                    )
                                    Text(
                                        text = sub.title,
                                        style = MaterialTheme.typography.bodySmall,
                                        textDecoration = if (sub.completed) TextDecoration.LineThrough else null,
                                        color = if (sub.completed) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
                                    )
                                }
                            }
                        }
                    }
                }

                // Bottom Action: Deep Work Focus button
                if (!isCompleted) {
                    Spacer(Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End,
                    ) {
                        AssistChip(
                            onClick = onStartFocus,
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Filled.PlayArrow,
                                    contentDescription = null,
                                    tint = IndigoPrimary,
                                    modifier = Modifier.size(16.dp),
                                )
                            },
                            label = { Text("Deep Work Focus") },
                            colors = AssistChipDefaults.assistChipColors(
                                containerColor = IndigoPrimary.copy(alpha = 0.12f),
                                labelColor = IndigoPrimary,
                            ),
                        )
                    }
                }
            }
        }
    }
}
