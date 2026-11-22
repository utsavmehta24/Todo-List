package com.utsavmehta.todolist.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.AuthRepository
import com.utsavmehta.todolist.domain.model.AppResult
import com.utsavmehta.todolist.domain.model.FormField
import com.utsavmehta.todolist.domain.validation.Validators
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val emailError: String? = null,
    val passwordError: String? = null,
    val formError: String? = null,
    val isSubmitting: Boolean = false,
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onEmailChange(value: String) {
        _uiState.update { it.copy(email = value, emailError = null, formError = null) }
    }

    fun onPasswordChange(value: String) {
        _uiState.update { it.copy(password = value, passwordError = null, formError = null) }
    }

    fun onQuickDemo() {
        viewModelScope.launch {
            authRepository.quickDemoLogin()
        }
    }

    fun onSubmit() {
        val current = _uiState.value
        if (current.isSubmitting) return

        val emailError = Validators.validateEmail(current.email)
        val passwordError = Validators.validateLoginPassword(current.password)
        if (emailError != null || passwordError != null) {
            _uiState.update {
                it.copy(emailError = emailError, passwordError = passwordError, formError = null)
            }
            return
        }

        val email = current.email
        val password = current.password
        _uiState.update { it.copy(isSubmitting = true, formError = null) }

        viewModelScope.launch {
            when (val result = authRepository.login(email, password)) {
                is AppResult.Success -> {
                    _uiState.update { it.copy(isSubmitting = false) }
                }
                is AppResult.Error -> _uiState.update { state ->
                    when (result.field) {
                        FormField.EMAIL -> state.copy(isSubmitting = false, emailError = result.message)
                        FormField.PASSWORD -> state.copy(isSubmitting = false, passwordError = result.message)
                        else -> state.copy(isSubmitting = false, formError = result.message)
                    }
                }
            }
        }
    }
}
