package com.utsavmehta.todolist.ui.tasks

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.ui.components.FormTextField
import com.utsavmehta.todolist.ui.components.LoadingButton
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState

@Composable
fun AddTaskScreen(
    onTaskSaved: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: AddTaskViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = LocalSnackbarHostState.current

    LaunchedEffect(state.saved) {
        if (state.saved) {
            onTaskSaved()
            viewModel.onSavedHandled()
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
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        FormTextField(
            value = state.title,
            onValueChange = viewModel::onTitleChange,
            label = "Title",
            error = state.titleError,
            imeAction = ImeAction.Next,
        )

        FormTextField(
            value = state.description,
            onValueChange = viewModel::onDescriptionChange,
            label = "Description",
            error = state.descriptionError,
            singleLine = false,
            minLines = 4,
            imeAction = ImeAction.Default,
        )

        Text(
            text = "Status",
            style = MaterialTheme.typography.labelLarge,
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            TaskStatus.entries.forEach { status ->
                FilterChip(
                    selected = state.status == status,
                    onClick = { viewModel.onStatusChange(status) },
                    label = { Text(status.label) },
                )
            }
        }

        LoadingButton(
            text = "Add task",
            onClick = viewModel::onSave,
            isLoading = state.isSaving,
        )

        TextButton(onClick = viewModel::onClear) {
            Text("Clear")
        }
    }
}
