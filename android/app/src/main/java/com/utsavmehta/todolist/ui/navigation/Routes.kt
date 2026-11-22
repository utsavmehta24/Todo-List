package com.utsavmehta.todolist.ui.navigation

object Routes {
    const val TASKS = "tasks"
    const val FOCUS = "focus"
    const val KANBAN = "kanban"
    const val WIDGETS = "widgets"
    const val DASHBOARD = "dashboard"
    const val ADD_TASK = "tasks/add"
    const val HOME = "home"
    const val LOGIN = "login"
    const val SIGNUP = "signup"
    const val REVIEWS = "reviews"
    const val WRITE_REVIEW = "reviews/write"

    fun titleFor(route: String?): String = when (route) {
        TASKS -> "TaskFlow"
        FOCUS -> "Pomodoro Focus"
        KANBAN -> "Kanban Workflow"
        WIDGETS -> "Productivity Widgets"
        DASHBOARD -> "Dashboard & Stats"
        ADD_TASK -> "New Task"
        LOGIN -> "Log in"
        SIGNUP -> "Sign up"
        REVIEWS -> "Reviews"
        WRITE_REVIEW -> "Write a Review"
        else -> "TaskFlow"
    }
}
