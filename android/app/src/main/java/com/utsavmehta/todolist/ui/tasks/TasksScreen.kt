package com.utsavmehta.todolist.ui.tasks

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.ui.components.EmptyState
import com.utsavmehta.todolist.ui.components.FullScreenLoading
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState

@Composable
fun TasksScreen(
    onAddTask: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: TasksViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = LocalSnackbarHostState.current

    LaunchedEffect(state.userMessage) {
        state.userMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.onUserMessageShown()
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        when {
            state.isLoading -> FullScreenLoading()

            state.tasks.isEmpty() -> EmptyState(
                title = "No tasks yet",
                message = "Create your first task to get started.",
                action = {
                    Button(onClick = onAddTask) {
                        Text("Add task")
                    }
                },
            )

            else -> {
                val total = state.tasks.size
                val pending = state.tasks.count { it.status == TaskStatus.PENDING }
                val completed = state.tasks.count { it.status == TaskStatus.COMPLETED }
                val totalLabel = if (total == 1) "1 task" else "$total tasks"

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(start = 16.dp, top = 16.dp, end = 16.dp, bottom = 88.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    item {
                        Text(
                            text = "$totalLabel · $pending pending · $completed completed",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    items(state.tasks, key = { it.id }) { task ->
                        TaskItem(
                            task = task,
                            onToggleStatus = { viewModel.onToggleStatus(task) },
                            onDelete = { viewModel.onDeleteRequest(task) },
                            modifier = Modifier.fillMaxWidth(),
                        )
                    }
                }

                ExtendedFloatingActionButton(
                    onClick = onAddTask,
                    icon = { Icon(Icons.Filled.Add, contentDescription = null) },
                    text = { Text("Add task") },
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(16.dp),
                )
            }
        }
    }

    state.pendingDeleteTask?.let { task ->
        AlertDialog(
            onDismissRequest = viewModel::onDeleteDismiss,
            title = { Text("Delete task?") },
            text = { Text("\"${task.title}\" will be permanently deleted.") },
            confirmButton = {
                TextButton(onClick = { viewModel.onDeleteConfirm() }) {
                    Text("Delete")
                }
            },
            dismissButton = {
                TextButton(onClick = { viewModel.onDeleteDismiss() }) {
                    Text("Cancel")
                }
            },
        )
    }
}
