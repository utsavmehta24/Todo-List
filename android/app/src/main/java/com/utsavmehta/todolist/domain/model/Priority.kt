package com.utsavmehta.todolist.domain.model

enum class Priority(val label: String, val level: Int) {
    LOW("Low", 1),
    MEDIUM("Medium", 2),
    HIGH("High", 3),
    URGENT("Urgent", 4);

    companion object {
        fun fromString(value: String?): Priority =
            entries.firstOrNull { it.name.equals(value, ignoreCase = true) || it.label.equals(value, ignoreCase = true) }
                ?: MEDIUM
    }
}
