package com.utsavmehta.todolist.domain.model

enum class Energy(val label: String, val emoji: String, val defaultMinutes: Int) {
    QUICK_WIN("Quick Win", "⚡", 15),
    LOW("Low Energy", "🟢", 25),
    MEDIUM("Medium Focus", "🟡", 45),
    HIGH("Deep Work", "🔴", 60);

    companion object {
        fun fromString(value: String?): Energy =
            entries.firstOrNull { it.name.equals(value, ignoreCase = true) || it.label.equals(value, ignoreCase = true) }
                ?: MEDIUM
    }
}
