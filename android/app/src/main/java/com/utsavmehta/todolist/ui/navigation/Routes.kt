package com.utsavmehta.todolist.ui.navigation

object Routes {
    const val HOME = "home"
    const val LOGIN = "login"
    const val SIGNUP = "signup"
    const val DASHBOARD = "dashboard"
    const val TASKS = "tasks"
    const val ADD_TASK = "tasks/add"
    const val REVIEWS = "reviews"
    const val WRITE_REVIEW = "reviews/write"

    fun titleFor(route: String?): String = when (route) {
        HOME -> "TaskFlow"
        LOGIN -> "Log in"
        SIGNUP -> "Sign up"
        DASHBOARD -> "Dashboard"
        TASKS -> "My Tasks"
        ADD_TASK -> "Add Task"
        REVIEWS -> "Reviews"
        WRITE_REVIEW -> "Write a Review"
        else -> "TaskFlow"
    }
}
