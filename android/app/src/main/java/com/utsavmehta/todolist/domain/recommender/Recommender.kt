package com.utsavmehta.todolist.domain.recommender

import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStatus

data class RecommendationResult(
    val task: Task,
    val score: Int,
    val reason: String,
)

object Recommender {
    fun recommendNext(
        tasks: List<Task>,
        currentEnergy: Energy = Energy.MEDIUM,
        availableMinutes: Int = 30,
    ): RecommendationResult? {
        val candidates = tasks.filter { it.status != TaskStatus.COMPLETED }
        if (candidates.isEmpty()) return null

        val now = System.currentTimeMillis()
        val scored = candidates.map { task ->
            var score = 0
            var reason = "Balanced next step for your day"

            // 1. Urgency / Due date
            task.dueDate?.let { due ->
                if (due < now) {
                    score += 50
                    reason = "Overdue! Clear this to remove cognitive anxiety."
                } else if (due - now < 24 * 60 * 60 * 1000) {
                    score += 35
                    reason = "Due today. Complete now to stay ahead."
                }
            }

            // 2. Priority
            when (task.priority) {
                Priority.URGENT -> {
                    score += 30
                    if (reason.startsWith("Balanced")) reason = "Top priority item needing urgent focus."
                }
                Priority.HIGH -> score += 20
                Priority.MEDIUM -> score += 10
                Priority.LOW -> score += 5
            }

            // 3. Energy match
            if (task.energy == currentEnergy) {
                score += 15
            } else if (currentEnergy == Energy.QUICK_WIN && task.energy == Energy.QUICK_WIN) {
                score += 25
                reason = "Quick dopamine boost! Complete in ~${task.estimatedMinutes}m."
            }

            // 4. Time fit
            if (task.estimatedMinutes <= availableMinutes) {
                score += 10
            }

            RecommendationResult(task, score, reason)
        }

        return scored.maxByOrNull { it.score }
    }
}
