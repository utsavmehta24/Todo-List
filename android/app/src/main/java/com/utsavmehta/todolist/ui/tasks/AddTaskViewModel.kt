package com.utsavmehta.todolist.ui.tasks

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.AuthRepository
import com.utsavmehta.todolist.data.repository.TaskRepository
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.domain.validation.ValidationMessages
import com.utsavmehta.todolist.domain.validation.Validators
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AddTaskUiState(
    val title: String = "",
    val description: String = "",
    val status: TaskStatus = TaskStatus.PENDING,
    val priority: Priority = Priority.MEDIUM,
    val energy: Energy = Energy.MEDIUM,
    val estimatedMinutes: Int = 25,
    val tags: String = "",
    val subtasks: String = "",
    val titleError: String? = null,
    val descriptionError: String? = null,
    val isSaving: Boolean = false,
    val saved: Boolean = false,
    val userMessage: String? = null,
)

@HiltViewModel
class AddTaskViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val taskRepository: TaskRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AddTaskUiState())
    val uiState: StateFlow<AddTaskUiState> = _uiState.asStateFlow()

    fun onTitleChange(value: String) {
        _uiState.update { it.copy(title = value, titleError = null) }
    }

    fun onDescriptionChange(value: String) {
        _uiState.update { it.copy(description = value, descriptionError = null) }
    }

    fun onStatusChange(status: TaskStatus) {
        _uiState.update { it.copy(status = status) }
    }

    fun onPriorityChange(priority: Priority) {
        _uiState.update { it.copy(priority = priority) }
    }

    fun onEnergyChange(energy: Energy) {
        _uiState.update { it.copy(energy = energy) }
    }

    fun onEstimatedMinutesChange(minutes: Int) {
        _uiState.update { it.copy(estimatedMinutes = minutes) }
    }

    fun onTagsChange(tags: String) {
        _uiState.update { it.copy(tags = tags) }
    }

    fun onSubtasksChange(subtasks: String) {
        _uiState.update { it.copy(subtasks = subtasks) }
    }

    fun onClear() {
        _uiState.update {
            it.copy(
                title = "",
                description = "",
                status = TaskStatus.PENDING,
                priority = Priority.MEDIUM,
                energy = Energy.MEDIUM,
                estimatedMinutes = 25,
                tags = "",
                subtasks = "",
                titleError = null,
                descriptionError = null,
            )
        }
    }

    fun onSave() {
        val current = _uiState.value
        if (current.isSaving) return

        val titleError = Validators.validateTaskTitle(current.title)
        val descriptionError = Validators.validateTaskDescription(current.description)
        if (titleError != null || descriptionError != null) {
            _uiState.update { it.copy(titleError = titleError, descriptionError = descriptionError) }
            return
        }

        _uiState.update { it.copy(isSaving = true) }

        viewModelScope.launch {
            val user = authRepository.currentUser.first()
            if (user == null) {
                _uiState.update { it.copy(isSaving = false, userMessage = ValidationMessages.NOT_LOGGED_IN) }
                return@launch
            }

            when (val result = taskRepository.addTask(
                userId = user.id,
                title = current.title,
                description = current.description,
                status = current.status,
                priority = current.priority,
                energy = current.energy,
                estimatedMinutes = current.estimatedMinutes,
                tags = current.tags,
                subtasks = current.subtasks,
            )) {
                is AppResult.Success -> {
                    _uiState.update { it.copy(isSaving = false, saved = true) }
                }
                is AppResult.Error -> {
                    _uiState.update { state ->
                        when (result.field) {
                            FormField.TITLE -> state.copy(isSaving = false, titleError = result.message)
                            FormField.DESCRIPTION -> state.copy(isSaving = false, descriptionError = result.message)
                            else -> state.copy(isSaving = false, userMessage = result.message)
                        }
                    }
                }
            }
        }
    }

    fun onSavedHandled() {
        _uiState.update { it.copy(saved = false) }
    }

    fun onUserMessageShown() {
        _uiState.update { it.copy(userMessage = null) }
    }
}
