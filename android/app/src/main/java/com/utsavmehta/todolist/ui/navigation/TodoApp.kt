package com.utsavmehta.todolist.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.utsavmehta.todolist.domain.model.SessionState
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState

data class NavItem(val route: String, val label: String, val icon: ImageVector)

@Composable
fun TodoApp() {
    val navController = rememberNavController()
    val sessionViewModel: SessionViewModel = hiltViewModel()
    val sessionState by sessionViewModel.sessionState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    val bottomNavItems = listOf(
        NavItem(Routes.TASKS, "Tasks", Icons.AutoMirrored.Filled.List),
        NavItem(Routes.FOCUS, "Focus", Icons.Filled.PlayArrow),
        NavItem(Routes.KANBAN, "Kanban", Icons.Filled.Star),
        NavItem(Routes.WIDGETS, "Widgets", Icons.Filled.Info),
        NavItem(Routes.DASHBOARD, "Stats", Icons.Filled.Edit),
    )

    val showBottomBar = currentRoute in listOf(
        Routes.TASKS,
        Routes.FOCUS,
        Routes.KANBAN,
        Routes.WIDGETS,
        Routes.DASHBOARD,
        null,
    )

    CompositionLocalProvider(LocalSnackbarHostState provides snackbarHostState) {
        Scaffold(
            topBar = {
                TodoTopBar(
                    title = Routes.titleFor(currentRoute),
                    canNavigateBack = navController.previousBackStackEntry != null && !showBottomBar,
                    isLoggedIn = sessionState is SessionState.LoggedIn,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigate = { route ->
                        navController.navigateSingleTop(route)
                    },
                    onLogout = {
                        sessionViewModel.logout()
                    },
                )
            },
            bottomBar = {
                if (showBottomBar) {
                    NavigationBar {
                        bottomNavItems.forEach { item ->
                            val selected = currentRoute == item.route || (item.route == Routes.TASKS && currentRoute == null)
                            NavigationBarItem(
                                icon = { Icon(item.icon, contentDescription = item.label) },
                                label = { Text(item.label) },
                                selected = selected,
                                onClick = {
                                    if (currentRoute != item.route) {
                                        navController.navigate(item.route) {
                                            popUpTo(Routes.TASKS) { saveState = true }
                                            launchSingleTop = true
                                            restoreState = true
                                        }
                                    }
                                },
                            )
                        }
                    }
                }
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
