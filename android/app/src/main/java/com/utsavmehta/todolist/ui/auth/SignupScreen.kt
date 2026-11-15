package com.utsavmehta.todolist.ui.auth

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.utsavmehta.todolist.ui.components.FormTextField
import com.utsavmehta.todolist.ui.components.LoadingButton

@Composable
fun SignupScreen(
    onNavigateToLogin: () -> Unit,
    onSignupSuccess: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: SignupViewModel = hiltViewModel(),
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    val currentOnSignupSuccess by rememberUpdatedState(onSignupSuccess)

    LaunchedEffect(state.signupComplete) {
        if (state.signupComplete) {
            currentOnSignupSuccess()
            viewModel.onSignupHandled()
        }
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text(
            text = "Sign up",
            style = MaterialTheme.typography.headlineMedium,
        )

        FormTextField(
            value = state.name,
            onValueChange = viewModel::onNameChange,
            label = "Name",
            imeAction = ImeAction.Next,
            error = state.nameError,
            enabled = !state.isSubmitting,
        )

        FormTextField(
            value = state.email,
            onValueChange = viewModel::onEmailChange,
            label = "Email",
            keyboardType = KeyboardType.Email,
            imeAction = ImeAction.Next,
            error = state.emailError,
            enabled = !state.isSubmitting,
        )

        FormTextField(
            value = state.password,
            onValueChange = viewModel::onPasswordChange,
            label = "Password",
            isPassword = true,
            imeAction = ImeAction.Done,
            error = state.passwordError,
            enabled = !state.isSubmitting,
        )

        state.formError?.let { message ->
            Text(
                text = message,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium,
            )
        }

        LoadingButton(
            text = "Create account",
            onClick = viewModel::onSubmit,
            isLoading = state.isSubmitting,
        )

        TextButton(onClick = onNavigateToLogin) {
            Text("Already have an account? Log in")
        }
    }
}
