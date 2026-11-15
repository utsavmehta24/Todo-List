package com.utsavmehta.todolist.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import com.utsavmehta.todolist.domain.model.SessionState
import com.utsavmehta.todolist.domain.model.User
import com.utsavmehta.todolist.ui.components.FullScreenLoading

/** Renders [content] only for a logged-in user; redirects logged-out users via [onUnauthenticated]. */
@Composable
fun AuthGuard(
    sessionState: SessionState,
    onUnauthenticated: () -> Unit,
    content: @Composable (User) -> Unit,
) {
    when (sessionState) {
        SessionState.Loading -> FullScreenLoading()
        SessionState.LoggedOut -> {
            LaunchedEffect(Unit) { onUnauthenticated() }
            FullScreenLoading()
        }
        is SessionState.LoggedIn -> content(sessionState.user)
    }
}

/** Renders [content] only for logged-out users; redirects logged-in users via [onAuthenticated]. */
@Composable
fun GuestGuard(
    sessionState: SessionState,
    onAuthenticated: () -> Unit,
    content: @Composable () -> Unit,
) {
    when (sessionState) {
        SessionState.Loading -> FullScreenLoading()
        is SessionState.LoggedIn -> {
            LaunchedEffect(Unit) { onAuthenticated() }
            FullScreenLoading()
        }
        SessionState.LoggedOut -> content()
    }
}
