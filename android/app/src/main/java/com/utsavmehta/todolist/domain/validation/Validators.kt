package com.utsavmehta.todolist.domain.validation

object Limits {
    const val NAME_MAX = 50
    const val PASSWORD_MIN = 6
    const val TITLE_MAX = 100
    const val TASK_DESCRIPTION_MAX = 1000
    const val REVIEW_DESCRIPTION_MAX = 500
}

object ValidationMessages {
    const val NAME_REQUIRED = "Please Enter Your Name"
    const val NAME_TOO_LONG = "Name must be at most 50 characters"
    const val EMAIL_REQUIRED = "Please Enter Your Email"
    const val EMAIL_INVALID = "Please enter a valid email address"
    const val EMAIL_TAKEN = "An account with this email already exists"
    const val PASSWORD_REQUIRED = "Please Enter Your Password"
    const val PASSWORD_TOO_SHORT = "Password must be at least 6 characters"
    const val INVALID_CREDENTIALS = "Invalid email or password"
    const val TITLE_REQUIRED = "Title is required"
    const val TITLE_TOO_LONG = "Title must be at most 100 characters"
    const val DESCRIPTION_REQUIRED = "Description is required"
    const val DESCRIPTION_TOO_LONG = "Description is too long"
    const val RATING_REQUIRED = "Please select a rating between 1 and 5"
    const val TASK_NOT_FOUND = "Task not found"
    const val NOT_LOGGED_IN = "You must be logged in"
    const val GENERIC = "Something went wrong"
}

/** Each validator returns null when the input is valid, otherwise the user-facing message. */
object Validators {
    private val EMAIL_REGEX = Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")

    fun normalizeEmail(email: String): String = email.trim().lowercase(java.util.Locale.ROOT)

    fun validateName(name: String): String? = when {
        name.isBlank() -> ValidationMessages.NAME_REQUIRED
        name.trim().length > Limits.NAME_MAX -> ValidationMessages.NAME_TOO_LONG
        else -> null
    }

    fun validateEmail(email: String): String? = when {
        email.isBlank() -> ValidationMessages.EMAIL_REQUIRED
        !EMAIL_REGEX.matches(email.trim()) -> ValidationMessages.EMAIL_INVALID
        else -> null
    }

    /** Signup rule: required and at least [Limits.PASSWORD_MIN] characters (not trimmed). */
    fun validateNewPassword(password: String): String? = when {
        password.isBlank() -> ValidationMessages.PASSWORD_REQUIRED
        password.length < Limits.PASSWORD_MIN -> ValidationMessages.PASSWORD_TOO_SHORT
        else -> null
    }

    /** Login rule: required only. */
    fun validateLoginPassword(password: String): String? =
        if (password.isBlank()) ValidationMessages.PASSWORD_REQUIRED else null

    fun validateTaskTitle(title: String): String? = when {
        title.isBlank() -> ValidationMessages.TITLE_REQUIRED
        title.trim().length > Limits.TITLE_MAX -> ValidationMessages.TITLE_TOO_LONG
        else -> null
    }

    fun validateTaskDescription(description: String): String? = when {
        description.isBlank() -> ValidationMessages.DESCRIPTION_REQUIRED
        description.length > Limits.TASK_DESCRIPTION_MAX -> ValidationMessages.DESCRIPTION_TOO_LONG
        else -> null
    }

    fun validateRating(rating: Int): String? =
        if (rating !in 1..5) ValidationMessages.RATING_REQUIRED else null

    fun validateReviewDescription(description: String): String? = when {
        description.isBlank() -> ValidationMessages.DESCRIPTION_REQUIRED
        description.length > Limits.REVIEW_DESCRIPTION_MAX -> ValidationMessages.DESCRIPTION_TOO_LONG
        else -> null
    }
}
