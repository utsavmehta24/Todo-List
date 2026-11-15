package com.utsavmehta.todolist.domain.model

enum class TaskStatus(val storageValue: String, val label: String) {
    PENDING("pending", "Pending"),
    COMPLETED("completed", "Completed");

    fun toggled(): TaskStatus = if (this == PENDING) COMPLETED else PENDING

    companion object {
        fun fromStorage(value: String): TaskStatus =
            entries.firstOrNull { it.storageValue == value } ?: PENDING
    }
}
