package com.utsavmehta.todolist.domain.parser

import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import java.util.Calendar

data class ParsedTaskInput(
    val cleanTitle: String,
    val priority: Priority = Priority.MEDIUM,
    val energy: Energy = Energy.MEDIUM,
    val estimatedMinutes: Int = 25,
    val dueDate: Long? = null,
    val tags: List<String> = emptyList(),
)

object NlpParser {
    fun parse(rawText: String): ParsedTaskInput {
        var text = rawText
        var priority = Priority.MEDIUM
        var energy = Energy.MEDIUM
        var estimatedMinutes = 25
        var dueDate: Long? = null
        val tags = mutableListOf<String>()

        // 1. Tags: #work, #study, #dev
        val tagRegex = Regex("""#([a-zA-Z0-9_\-]+)""")
        tagRegex.findAll(text).forEach { match ->
            tags.add(match.groupValues[1])
        }
        text = text.replace(tagRegex, " ")

        // 2. Priority: !urgent, !high, !medium, !low
        val priorityRegex = Regex("""!(urgent|high|medium|low|med)""", RegexOption.IGNORE_CASE)
        val priorityMatch = priorityRegex.find(text)
        if (priorityMatch != null) {
            val pStr = priorityMatch.groupValues[1].lowercase()
            priority = when (pStr) {
                "urgent" -> Priority.URGENT
                "high" -> Priority.HIGH
                "low" -> Priority.LOW
                else -> Priority.MEDIUM
            }
            text = text.replace(priorityRegex, " ")
        }

        // 3. Energy: @quick_win, @quick, @low, @medium, @high, @deep
        val energyRegex = Regex("""@(quick_win|quick|low|medium|med|high|deep)""", RegexOption.IGNORE_CASE)
        val energyMatch = energyRegex.find(text)
        if (energyMatch != null) {
            val eStr = energyMatch.groupValues[1].lowercase()
            energy = when (eStr) {
                "quick_win", "quick" -> Energy.QUICK_WIN
                "low" -> Energy.LOW
                "high", "deep" -> Energy.HIGH
                else -> Energy.MEDIUM
            }
            text = text.replace(energyRegex, " ")
        }

        // 4. Time estimate: ~15m, ~30m, ~1h, ~2h, ~1.5h
        val timeRegex = Regex("""~(\d+(?:\.\d+)?)\s*(m|min|mins|h|hr|hrs)?\b""", RegexOption.IGNORE_CASE)
        val timeMatch = timeRegex.find(text)
        if (timeMatch != null) {
            val num = timeMatch.groupValues[1].toDoubleOrNull() ?: 25.0
            val unit = timeMatch.groupValues[2].lowercase()
            estimatedMinutes = if (unit.startsWith("h")) (num * 60).toInt() else num.toInt()
            text = text.replace(timeRegex, " ")
        }

        // 5. Due date: today, tomorrow
        val dueRegex = Regex("""\b(today|tomorrow)\b""", RegexOption.IGNORE_CASE)
        val dueMatch = dueRegex.find(text)
        if (dueMatch != null) {
            val cal = Calendar.getInstance()
            if (dueMatch.groupValues[1].equals("tomorrow", ignoreCase = true)) {
                cal.add(Calendar.DAY_OF_YEAR, 1)
            }
            cal.set(Calendar.HOUR_OF_DAY, 23)
            cal.set(Calendar.MINUTE, 59)
            cal.set(Calendar.SECOND, 0)
            cal.set(Calendar.MILLISECOND, 0)
            dueDate = cal.timeInMillis
            text = text.replace(dueRegex, " ")
        }

        val cleanTitle = text.trim().replace(Regex("""\s+"""), " ")
        return ParsedTaskInput(
            cleanTitle = cleanTitle.ifBlank { rawText.trim() },
            priority = priority,
            energy = energy,
            estimatedMinutes = estimatedMinutes,
            dueDate = dueDate,
            tags = tags,
        )
    }
}
