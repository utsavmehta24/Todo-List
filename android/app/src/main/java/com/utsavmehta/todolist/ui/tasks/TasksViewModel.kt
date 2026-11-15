package com.utsavmehta.todolist.ui.tasks

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.AuthRepository
import com.utsavmehta.todolist.data.repository.TaskRepository
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.validation.ValidationMessages
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class TasksUiState(
    val tasks: List<Task> = emptyList(),
    val isLoading: Boolean = true,
    val pendingDeleteTask: Task? = null,
    val userMessage: String? = null,
)

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class TasksViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val taskRepository: TaskRepository,
) : ViewModel() {

    private val pendingDeleteTask = MutableStateFlow<Task?>(null)
    private val userMessage = MutableStateFlow<String?>(null)

    private val tasksFlow: Flow<List<Task>> = authRepository.currentUser.flatMapLatest { user ->
        if (user == null) {
            flowOf(emptyList<Task>())
        } else {
            taskRepository.observeTasks(user.id)
        }
    }

    val uiState: StateFlow<TasksUiState> = combine(
        tasksFlow,
        pendingDeleteTask,
        userMessage,
    ) { tasks, pending, message ->
        TasksUiState(
            tasks = tasks,
            isLoading = false,
            pendingDeleteTask = pending,
            userMessage = message,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), TasksUiState())

    fun onToggleStatus(task: Task) {
        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            if (user == null) {
                userMessage.value = ValidationMessages.NOT_LOGGED_IN
                return@launch
            }
            val result = taskRepository.updateStatus(task.id, user.id, task.status.toggled())
            if (result is AppResult.Error) {
                userMessage.value = result.message
            }
        }
    }

    fun onDeleteRequest(task: Task) {
        pendingDeleteTask.value = task
    }

    fun onDeleteDismiss() {
        pendingDeleteTask.value = null
    }

    fun onDeleteConfirm() {
        val task = pendingDeleteTask.value ?: return
        pendingDeleteTask.value = null
        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            if (user == null) {
                userMessage.value = ValidationMessages.NOT_LOGGED_IN
                return@launch
            }
            val result = taskRepository.deleteTask(task.id, user.id)
            userMessage.value = when (result) {
                is AppResult.Success -> "Task deleted"
                is AppResult.Error -> result.message
            }
        }
    }

    fun onUserMessageShown() {
        userMessage.value = null
    }
}
