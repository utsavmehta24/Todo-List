package com.utsavmehta.todolist.ui.tasks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.TabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.ui.components.AboutDialog
import com.utsavmehta.todolist.ui.components.EmptyState
import com.utsavmehta.todolist.ui.components.FullScreenLoading
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState
import com.utsavmehta.todolist.ui.components.RecommenderDialog
import com.utsavmehta.todolist.ui.theme.EnergyQuickWin
import com.utsavmehta.todolist.ui.theme.IndigoPrimary

enum class TaskFilter(val label: String) {
    ALL("All"),
    PENDING("To Do"),
    URGENT("🔥 Urgent"),
    QUICK_WIN("⚡ Quick Wins"),
    COMPLETED("Completed"),
}

@OptIn(ExperimentalLayoutApi::class, ExperimentalMaterial3Api::class)
@Composable
fun TasksScreen(
    onAddTask: () -> Unit,
    initialTab: Int = 0,
    modifier: Modifier = Modifier,
    viewModel: TasksViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = LocalSnackbarHostState.current

    var selectedTab by remember(initialTab) { mutableIntStateOf(initialTab) } // 0 = List, 1 = Kanban, 2 = Focus
    var selectedFilter by remember { mutableStateOf(TaskFilter.ALL) }
    var activeFocusTask by remember { mutableStateOf<Task?>(null) }
    var showRecommender by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }

    LaunchedEffect(state.userMessage) {
        state.userMessage?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.onUserMessageShown()
        }
    }

    if (activeFocusTask != null) {
        FocusTimerScreen(
            task = activeFocusTask,
            onCompleteTask = { task ->
                viewModel.onUpdateStatus(task, TaskStatus.COMPLETED)
            },
            onClose = { activeFocusTask = null },
        )
        return
    }

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        when {
            state.isLoading -> FullScreenLoading()

            else -> {
                Column(modifier = Modifier.fillMaxSize()) {
                    // Top Bar with Actions
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        tonalElevation = 2.dp,
                        modifier = Modifier.fillMaxWidth(),
                    ) {
                        Column(modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 4.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.clickable { showAboutDialog = true },
                                ) {
                                    Text(
                                        text = "TaskFlow",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold,
                                        color = IndigoPrimary,
                                    )
                                    Spacer(Modifier.padding(horizontal = 4.dp))
                                    Surface(
                                        shape = RoundedCornerShape(8.dp),
                                        color = IndigoPrimary.copy(alpha = 0.12f),
                                    ) {
                                        Text(
                                            text = "by Utsav",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = IndigoPrimary,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                        )
                                    }
                                }

                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedButton(
                                        onClick = { showRecommender = true },
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    ) {
                                        Text("⚡ What Now?", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                                    }

                                    Button(
                                        onClick = {
                                            activeFocusTask = state.tasks.firstOrNull { it.status != TaskStatus.COMPLETED }
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    ) {
                                        Icon(Icons.Filled.PlayArrow, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.padding(horizontal = 2.dp))
                                        Text("Focus", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }

                            // View tabs: List, Kanban, Focus
                            TabRow(
                                selectedTabIndex = selectedTab,
                                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                            ) {
                                Tab(
                                    selected = selectedTab == 0,
                                    onClick = { selectedTab = 0 },
                                    text = { Text("Tasks (${state.tasks.count { it.status != TaskStatus.COMPLETED }})") },
                                )
                                Tab(
                                    selected = selectedTab == 1,
                                    onClick = { selectedTab = 1 },
                                    text = { Text("Kanban") },
                                )
                                Tab(
                                    selected = selectedTab == 2,
                                    onClick = { selectedTab = 2 },
                                    text = { Text("Focus Mode") },
                                )
                            }
                        }
                    }

                    when (selectedTab) {
                        0 -> {
                            // LIST VIEW
                            val filteredTasks = remember(state.tasks, selectedFilter) {
                                when (selectedFilter) {
                                    TaskFilter.ALL -> state.tasks
                                    TaskFilter.PENDING -> state.tasks.filter { it.status != TaskStatus.COMPLETED }
                                    TaskFilter.URGENT -> state.tasks.filter { it.priority == Priority.URGENT && it.status != TaskStatus.COMPLETED }
                                    TaskFilter.QUICK_WIN -> state.tasks.filter { it.energy == Energy.QUICK_WIN && it.status != TaskStatus.COMPLETED }
                                    TaskFilter.COMPLETED -> state.tasks.filter { it.status == TaskStatus.COMPLETED }
                                }
                            }

                            LazyColumn(
                                modifier = Modifier.fillMaxSize(),
                                contentPadding = PaddingValues(start = 16.dp, top = 12.dp, end = 16.dp, bottom = 88.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp),
                            ) {
                                // NLP Quick Add Input
                                item {
                                    NlpQuickAddBar(onAddTask = viewModel::onAddQuickTask)
                                }

                                // Filter chips row
                                item {
                                    FlowRow(
                                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                                        verticalArrangement = Arrangement.spacedBy(6.dp),
                                    ) {
                                        TaskFilter.entries.forEach { filter ->
                                            FilterChip(
                                                selected = selectedFilter == filter,
                                                onClick = { selectedFilter = filter },
                                                label = { Text(filter.label) },
                                            )
                                        }
                                    }
                                }

                                if (filteredTasks.isEmpty()) {
                                    item {
                                        Card(
                                            modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
                                            shape = RoundedCornerShape(16.dp),
                                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                                        ) {
                                            Column(
                                                modifier = Modifier.fillMaxWidth().padding(24.dp),
                                                horizontalAlignment = Alignment.CenterHorizontally,
                                            ) {
                                                Text(
                                                    text = "✨ Zero Tasks in this View",
                                                    style = MaterialTheme.typography.titleMedium,
                                                    fontWeight = FontWeight.Bold,
                                                )
                                                Spacer(Modifier.height(4.dp))
                                                Text(
                                                    text = "Type in the quick add bar above or click \"+ Add task\".",
                                                    style = MaterialTheme.typography.bodySmall,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    items(filteredTasks, key = { it.id }) { task ->
                                        TaskItem(
                                            task = task,
                                            onToggleStatus = { viewModel.onToggleStatus(task) },
                                            onDelete = { viewModel.onDeleteRequest(task) },
                                            onStartFocus = { activeFocusTask = task },
                                            onUpdateTask = viewModel::onUpdateTask,
                                            modifier = Modifier.fillMaxWidth(),
                                        )
                                    }
                                }
                            }
                        }

                        1 -> {
                            // KANBAN VIEW
                            val todoTasks = state.tasks.filter { it.status == TaskStatus.PENDING }
                            val inProgressTasks = state.tasks.filter { it.status == TaskStatus.IN_PROGRESS }
                            val completedTasks = state.tasks.filter { it.status == TaskStatus.COMPLETED }

                            LazyColumn(
                                modifier = Modifier.fillMaxSize(),
                                contentPadding = PaddingValues(16.dp),
                                verticalArrangement = Arrangement.spacedBy(16.dp),
                            ) {
                                item {
                                    KanbanColumnCard(
                                        title = "To Do (${todoTasks.size})",
                                        tasks = todoTasks,
                                        nextStatus = TaskStatus.IN_PROGRESS,
                                        nextActionLabel = "Start ->",
                                        onMoveStatus = { task, next -> viewModel.onUpdateStatus(task, next) },
                                        onStartFocus = { activeFocusTask = it },
                                    )
                                }
                                item {
                                    KanbanColumnCard(
                                        title = "In Progress (${inProgressTasks.size})",
                                        tasks = inProgressTasks,
                                        nextStatus = TaskStatus.COMPLETED,
                                        nextActionLabel = "Done ->",
                                        onMoveStatus = { task, next -> viewModel.onUpdateStatus(task, next) },
                                        onStartFocus = { activeFocusTask = it },
                                    )
                                }
                                item {
                                    KanbanColumnCard(
                                        title = "Completed (${completedTasks.size})",
                                        tasks = completedTasks,
                                        nextStatus = TaskStatus.PENDING,
                                        nextActionLabel = "Reopen",
                                        onMoveStatus = { task, next -> viewModel.onUpdateStatus(task, next) },
                                        onStartFocus = { activeFocusTask = it },
                                    )
                                }
                            }
                        }

                        2 -> {
                            // FOCUS MODE TAB
                            val candidate = state.tasks.firstOrNull { it.status != TaskStatus.COMPLETED }
                            FocusTimerScreen(
                                task = candidate,
                                onCompleteTask = { task ->
                                    viewModel.onUpdateStatus(task, TaskStatus.COMPLETED)
                                },
                                onClose = { selectedTab = 0 },
                            )
                        }
                    }
                }

                if (selectedTab != 2) {
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

        // Delete Dialog
        state.pendingDeleteTask?.let { task ->
            AlertDialog(
                onDismissRequest = viewModel::onDeleteDismiss,
                title = { Text("Delete task?") },
                text = { Text("Are you sure you want to delete \"${task.title}\"? This action cannot be undone.") },
                confirmButton = {
                    Button(onClick = viewModel::onDeleteConfirm) {
                        Text("Delete")
                    }
                },
                dismissButton = {
                    TextButton(onClick = viewModel::onDeleteDismiss) {
                        Text("Cancel")
                    }
                },
            )
        }

        // Recommender Modal
        if (showRecommender) {
            RecommenderDialog(
                tasks = state.tasks,
                onDismiss = { showRecommender = false },
                onStartFocus = { task -> activeFocusTask = task },
            )
        }

        // About Utsav Modal
        if (showAboutDialog) {
            AboutDialog(onDismiss = { showAboutDialog = false })
        }
    }
}

@Composable
fun KanbanColumnCard(
    title: String,
    tasks: List<Task>,
    nextStatus: TaskStatus,
    nextActionLabel: String,
    onMoveStatus: (Task, TaskStatus) -> Unit,
    onStartFocus: (Task) -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
            )
            Spacer(Modifier.height(12.dp))

            if (tasks.isEmpty()) {
                Text(
                    text = "No tasks in this lane",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    tasks.forEach { task ->
                        Card(
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                            modifier = Modifier.fillMaxWidth(),
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically,
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = task.title,
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.SemiBold,
                                    )
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        Text(
                                            text = "!${task.priority.label}",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = IndigoPrimary,
                                        )
                                        Text(
                                            text = "· ${task.energy.emoji} ~${task.estimatedMinutes}m",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        )
                                    }
                                }
                                Button(
                                    onClick = { onMoveStatus(task, nextStatus) },
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                                ) {
                                    Text(nextActionLabel, style = MaterialTheme.typography.labelSmall)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
