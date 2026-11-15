package com.utsavmehta.todolist.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.utsavmehta.todolist.domain.model.SessionState
import com.utsavmehta.todolist.ui.auth.LoginScreen
import com.utsavmehta.todolist.ui.auth.SignupScreen
import com.utsavmehta.todolist.ui.components.LocalSnackbarHostState
import com.utsavmehta.todolist.ui.dashboard.DashboardScreen
import com.utsavmehta.todolist.ui.home.HomeScreen
import com.utsavmehta.todolist.ui.reviews.ReviewsScreen
import com.utsavmehta.todolist.ui.reviews.WriteReviewScreen
import com.utsavmehta.todolist.ui.tasks.AddTaskScreen
import com.utsavmehta.todolist.ui.tasks.TasksScreen
import kotlinx.coroutines.launch

@Composable
fun TodoNavHost(
    navController: NavHostController,
    sessionState: SessionState,
    modifier: Modifier = Modifier,
) {
    val scope = rememberCoroutineScope()
    val snackbar = LocalSnackbarHostState.current
    val isLoggedIn = sessionState is SessionState.LoggedIn

    NavHost(
        navController = navController,
        startDestination = Routes.HOME,
        modifier = modifier,
    ) {
        composable(Routes.HOME) {
            HomeScreen(
                isLoggedIn = isLoggedIn,
                onGetStarted = {
                    navController.navigateSingleTop(if (isLoggedIn) Routes.DASHBOARD else Routes.SIGNUP)
                },
                onLogin = { navController.navigateSingleTop(Routes.LOGIN) },
                onViewReviews = { navController.navigateSingleTop(Routes.REVIEWS) },
            )
        }

        composable(Routes.LOGIN) { entry ->
            GuestGuard(
                sessionState = sessionState,
                onAuthenticated = {
                    if (navController.currentBackStackEntry?.id == entry.id) {
                        navController.navigateToDashboard()
                    }
                },
            ) {
                LoginScreen(
                    onNavigateToSignup = {
                        navController.navigate(Routes.SIGNUP) {
                            popUpTo(Routes.LOGIN) { inclusive = true }
                        }
                    },
                )
            }
        }

        composable(Routes.SIGNUP) { entry ->
            GuestGuard(
                sessionState = sessionState,
                onAuthenticated = {
                    if (navController.currentBackStackEntry?.id == entry.id) {
                        navController.navigateToDashboard()
                    }
                },
            ) {
                SignupScreen(
                    onNavigateToLogin = {
                        navController.navigate(Routes.LOGIN) {
                            popUpTo(Routes.SIGNUP) { inclusive = true }
                        }
                    },
                    onSignupSuccess = {
                        navController.navigate(Routes.LOGIN) {
                            popUpTo(Routes.SIGNUP) { inclusive = true }
                        }
                        scope.launch { snackbar.showSnackbar("Account created. Please log in.") }
                    },
                )
            }
        }

        composable(Routes.DASHBOARD) { entry ->
            AuthGuard(
                sessionState = sessionState,
                onUnauthenticated = {
                    if (navController.currentBackStackEntry?.id == entry.id) {
                        navController.navigateToLogin()
                    }
                },
            ) {
                DashboardScreen(
                    onViewTasks = { navController.navigateSingleTop(Routes.TASKS) },
                    onAddTask = { navController.navigateSingleTop(Routes.ADD_TASK) },
                    onViewReviews = { navController.navigateSingleTop(Routes.REVIEWS) },
                    onWriteReview = { navController.navigateSingleTop(Routes.WRITE_REVIEW) },
                )
            }
        }

        composable(Routes.TASKS) { entry ->
            AuthGuard(
                sessionState = sessionState,
                onUnauthenticated = {
                    if (navController.currentBackStackEntry?.id == entry.id) {
                        navController.navigateToLogin()
                    }
                },
            ) {
                TasksScreen(
                    onAddTask = { navController.navigateSingleTop(Routes.ADD_TASK) },
                )
            }
        }

        composable(Routes.ADD_TASK) { entry ->
            AuthGuard(
                sessionState = sessionState,
                onUnauthenticated = {
                    if (navController.currentBackStackEntry?.id == entry.id) {
                        navController.navigateToLogin()
                    }
                },
            ) {
                AddTaskScreen(
                    onTaskSaved = {
                        navController.popBackStack()
                        scope.launch { snackbar.showSnackbar("Task added successfully") }
                    },
                )
            }
        }

        composable(Routes.REVIEWS) {
            ReviewsScreen(
                isLoggedIn = isLoggedIn,
                onWriteReview = {
                    navController.navigateSingleTop(if (isLoggedIn) Routes.WRITE_REVIEW else Routes.LOGIN)
                },
            )
        }

        composable(Routes.WRITE_REVIEW) { entry ->
            AuthGuard(
                sessionState = sessionState,
                onUnauthenticated = {
                    if (navController.currentBackStackEntry?.id == entry.id) {
                        navController.navigateToLogin()
                    }
                },
            ) {
                WriteReviewScreen(
                    onReviewSubmitted = {
                        navController.popBackStack()
                        scope.launch { snackbar.showSnackbar("Review added successfully") }
                    },
                )
            }
        }
    }
}
