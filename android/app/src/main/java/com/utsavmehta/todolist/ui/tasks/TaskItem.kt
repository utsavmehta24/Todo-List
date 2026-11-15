package com.utsavmehta.todolist.ui.tasks

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.height
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.ui.components.formatDate

/**
 * One task row in the task list: title, description, creation date, status chip,
 * a completion toggle and a delete action.
 */
@Composable
fun TaskItem(
    task: Task,
    onToggleStatus: () -> Unit,
    onDelete: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val isCompleted = task.status == TaskStatus.COMPLETED
    val titleColor = if (isCompleted) {
        MaterialTheme.colorScheme.onSurfaceVariant
    } else {
        MaterialTheme.colorScheme.onSurface
    }

    Card(modifier = modifier.fillMaxWidth()) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.titleMedium,
                    color = titleColor,
                    textDecoration = if (isCompleted) TextDecoration.LineThrough else null,
                    modifier = Modifier.weight(1f),
                )
                IconButton(onClick = onDelete) {
                    Icon(
                        imageVector = Icons.Filled.Delete,
                        contentDescription = "Delete task",
                    )
                }
            }

            Spacer(Modifier.height(8.dp))
            Text(
                text = task.description,
                style = MaterialTheme.typography.bodyMedium,
                color = titleColor,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
            )

            Spacer(Modifier.height(8.dp))
            Text(
                text = "Added ${formatDate(task.addedDate)}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )

            Spacer(Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
            ) {
                AssistChip(
                    onClick = onToggleStatus,
                    label = { Text(task.status.label) },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = if (isCompleted) {
                            MaterialTheme.colorScheme.primaryContainer
                        } else {
                            MaterialTheme.colorScheme.surfaceVariant
                        },
                        labelColor = if (isCompleted) {
                            MaterialTheme.colorScheme.onPrimaryContainer
                        } else {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        },
                    ),
                )

                Row(
                    modifier = Modifier.clickable(
                        role = Role.Checkbox,
                        onClick = onToggleStatus,
                    ),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Checkbox(
                        checked = isCompleted,
                        onCheckedChange = null,
                    )
                    Text(
                        text = if (isCompleted) "Mark as pending" else "Mark as completed",
                        style = MaterialTheme.typography.labelLarge,
                        modifier = Modifier.padding(end = 8.dp),
                    )
                }
            }
        }
    }
}
