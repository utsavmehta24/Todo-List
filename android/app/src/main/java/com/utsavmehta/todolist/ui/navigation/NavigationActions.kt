package com.utsavmehta.todolist.ui.navigation

import androidx.navigation.NavHostController

fun NavHostController.navigateToLogin() {
    navigate(Routes.LOGIN) {
        popUpTo(Routes.HOME)
        launchSingleTop = true
    }
}

fun NavHostController.navigateToDashboard() {
    navigate(Routes.DASHBOARD) {
        popUpTo(Routes.HOME)
        launchSingleTop = true
    }
}

fun NavHostController.navigateHomeClearingBackStack() {
    navigate(Routes.HOME) {
        popUpTo(graph.id) { inclusive = true }
        launchSingleTop = true
    }
}

fun NavHostController.navigateSingleTop(route: String) {
    navigate(route) {
        launchSingleTop = true
    }
}
