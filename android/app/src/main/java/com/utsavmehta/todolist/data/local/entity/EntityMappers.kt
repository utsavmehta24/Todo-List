package com.utsavmehta.todolist.data.local.entity

import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.model.Review
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStats
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.domain.model.User

fun UserEntity.toDomain(): User = User(id = id, name = name, email = email)

fun TaskEntity.toDomain(): Task = Task(
    id = id,
    userId = userId,
    title = title,
    description = description,
    status = TaskStatus.fromStorage(status),
    addedDate = addedDate,
    priority = Priority.fromString(priority),
    energy = Energy.fromString(energy),
    estimatedMinutes = estimatedMinutes,
    dueDate = dueDate,
    tags = tags,
    subtasks = subtasks,
)

fun Task.toEntity(): TaskEntity = TaskEntity(
    id = id,
    userId = userId,
    title = title,
    description = description,
    status = status.storageValue,
    addedDate = addedDate,
    priority = priority.name,
    energy = energy.name,
    estimatedMinutes = estimatedMinutes,
    dueDate = dueDate,
    tags = tags,
    subtasks = subtasks,
)

fun TaskStatsRow.toDomain(): TaskStats = TaskStats(total = total, pending = pending, completed = completed)

fun ReviewWithAuthorRow.toDomain(): Review = Review(
    id = id,
    userId = userId,
    authorName = authorName,
    rating = rating,
    description = description,
    addedDate = addedDate,
)
