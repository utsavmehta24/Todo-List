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
import com.utsavmehta.todolist.ui.tasks.FocusTimerScreen
import com.utsavmehta.todolist.ui.tasks.TasksScreen
import com.utsavmehta.todolist.ui.widgets.WidgetsScreen
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
        startDestination = Routes.TASKS,
        modifier = modifier,
    ) {
        composable(Routes.TASKS) {
            TasksScreen(
                onAddTask = { navController.navigateSingleTop(Routes.ADD_TASK) },
            )
        }

        composable(Routes.FOCUS) {
            FocusTimerScreen(
                task = null,
                onCompleteTask = {
                    scope.launch { snackbar.showSnackbar("Focus session completed! Great job.") }
                    navController.popBackStack()
                },
                onClose = { navController.popBackStack() },
            )
        }

        composable(Routes.KANBAN) {
            TasksScreen(
                initialTab = 1,
                onAddTask = { navController.navigateSingleTop(Routes.ADD_TASK) },
            )
        }

        composable(Routes.WIDGETS) {
            WidgetsScreen(
                onNavigateToFocus = { task ->
                    navController.navigateSingleTop(Routes.FOCUS)
                },
                onNavigateToTasks = {
                    navController.navigateSingleTop(Routes.TASKS)
                },
            )
        }

        composable(Routes.DASHBOARD) {
            DashboardScreen(
                onViewTasks = { navController.navigateSingleTop(Routes.TASKS) },
                onAddTask = { navController.navigateSingleTop(Routes.ADD_TASK) },
                onViewReviews = { navController.navigateSingleTop(Routes.REVIEWS) },
                onWriteReview = { navController.navigateSingleTop(Routes.WRITE_REVIEW) },
            )
        }

        composable(Routes.ADD_TASK) {
            AddTaskScreen(
                onTaskSaved = {
                    navController.popBackStack()
                    scope.launch { snackbar.showSnackbar("Task added successfully") }
                },
            )
        }

        composable(Routes.HOME) {
            TasksScreen(
                onAddTask = { navController.navigateSingleTop(Routes.ADD_TASK) },
            )
        }

        composable(Routes.LOGIN) {
            LoginScreen(
                onNavigateToSignup = {
                    navController.navigate(Routes.SIGNUP) {
                        popUpTo(Routes.LOGIN) { inclusive = true }
                    }
                },
            )
        }

        composable(Routes.SIGNUP) {
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

        composable(Routes.REVIEWS) {
            ReviewsScreen(
                isLoggedIn = isLoggedIn,
                onWriteReview = {
                    navController.navigateSingleTop(if (isLoggedIn) Routes.WRITE_REVIEW else Routes.LOGIN)
                },
            )
        }

        composable(Routes.WRITE_REVIEW) {
            WriteReviewScreen(
                onReviewSubmitted = {
                    navController.popBackStack()
                    scope.launch { snackbar.showSnackbar("Review added successfully") }
                },
            )
        }
    }
}
