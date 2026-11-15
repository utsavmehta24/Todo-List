package com.utsavmehta.todolist.domain.model

enum class FormField { NAME, EMAIL, PASSWORD, TITLE, DESCRIPTION, RATING }

sealed interface AppResult<out T> {
    data class Success<out T>(val data: T) : AppResult<T>
    data class Error(val message: String, val field: FormField? = null) : AppResult<Nothing>
}
