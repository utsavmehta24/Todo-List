package com.utsavmehta.todolist.ui.components

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

fun formatDate(epochMillis: Long): String =
    DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.getDefault())
        .withZone(ZoneId.systemDefault())
        .format(Instant.ofEpochMilli(epochMillis))

fun formatDateTime(epochMillis: Long): String =
    DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm", Locale.getDefault())
        .withZone(ZoneId.systemDefault())
        .format(Instant.ofEpochMilli(epochMillis))
