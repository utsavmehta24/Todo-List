package com.utsavmehta.todolist.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.utsavmehta.todolist.domain.model.SessionState
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState

@Composable
fun TodoApp() {
    val navController = rememberNavController()
    val sessionViewModel: SessionViewModel = hiltViewModel()
    val sessionState by sessionViewModel.sessionState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    CompositionLocalProvider(LocalSnackbarHostState provides snackbarHostState) {
        Scaffold(
            topBar = {
                TodoTopBar(
                    title = Routes.titleFor(currentRoute),
                    canNavigateBack = navController.previousBackStackEntry != null,
                    isLoggedIn = sessionState is SessionState.LoggedIn,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigate = { route ->
                        if (route == Routes.HOME) {
                            if (!navController.popBackStack(Routes.HOME, inclusive = false)) {
                                navController.navigateHomeClearingBackStack()
                            }
                        } else {
                            navController.navigateSingleTop(route)
                        }
                    },
                    onLogout = {
                        navController.navigateHomeClearingBackStack()
                        sessionViewModel.logout()
                    },
                )
            },
            snackbarHost = { SnackbarHost(snackbarHostState) },
        ) { innerPadding ->
            TodoNavHost(
                navController = navController,
                sessionState = sessionState,
                modifier = Modifier.padding(innerPadding),
            )
        }
    }
}
