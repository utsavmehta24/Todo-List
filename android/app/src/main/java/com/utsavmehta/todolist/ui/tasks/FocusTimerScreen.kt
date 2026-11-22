package com.utsavmehta.todolist.ui.tasks

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.utsavmehta.todolist.domain.model.Task
import com.utsavmehta.todolist.domain.model.TaskStatus
import com.utsavmehta.todolist.ui.theme.EnergyQuickWin
import com.utsavmehta.todolist.ui.theme.IndigoPrimary
import kotlinx.coroutines.delay

@Composable
fun FocusTimerScreen(
    task: Task?,
    onCompleteTask: (Task) -> Unit,
    onClose: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val initialMinutes = task?.estimatedMinutes ?: 25
    var totalSeconds by remember { mutableIntStateOf(initialMinutes * 60) }
    var secondsRemaining by remember { mutableIntStateOf(totalSeconds) }
    var isRunning by remember { mutableStateOf(false) }
    var completedSession by remember { mutableStateOf(false) }

    LaunchedEffect(isRunning, secondsRemaining) {
        if (isRunning && secondsRemaining > 0) {
            delay(1000L)
            secondsRemaining -= 1
        } else if (isRunning && secondsRemaining == 0) {
            isRunning = false
            completedSession = true
        }
    }

    val progress by animateFloatAsState(
        targetValue = if (totalSeconds > 0) secondsRemaining.toFloat() / totalSeconds.toFloat() else 0f,
        label = "FocusProgress",
    )

    val minutes = secondsRemaining / 60
    val seconds = secondsRemaining % 60
    val timeFormatted = String.format("%02d:%02d", minutes, seconds)

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween,
    ) {
        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column {
                Text(
                    text = "DEEP WORK FOCUS",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = IndigoPrimary,
                )
                Text(
                    text = if (task != null) "Focusing on task" else "Freeflow Pomodoro",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            IconButton(onClick = onClose) {
                Icon(Icons.Filled.Close, contentDescription = "Close Focus Mode")
            }
        }

        // Active Task Card
        if (task != null) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = task.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                    )
                    if (task.description.isNotBlank()) {
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = task.description,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 2,
                        )
                    }
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        BadgeChip(label = "!${task.priority.label}", color = IndigoPrimary)
                        BadgeChip(label = "${task.energy.emoji} ${task.energy.label}", color = EnergyQuickWin)
                    }
                }
            }
        }

        // Circular Timer Display
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(260.dp),
        ) {
            val primaryColor = IndigoPrimary
            val surfaceVariant = MaterialTheme.colorScheme.surfaceVariant
            Canvas(modifier = Modifier.size(240.dp)) {
                // Background track
                drawCircle(
                    color = surfaceVariant,
                    style = Stroke(width = 16.dp.toPx()),
                )
                // Active countdown arc
                drawArc(
                    color = primaryColor,
                    startAngle = -90f,
                    sweepAngle = 360f * progress,
                    useCenter = false,
                    style = Stroke(width = 16.dp.toPx(), cap = StrokeCap.Round),
                )
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = timeFormatted,
                    style = MaterialTheme.typography.displayMedium,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = if (isRunning) "FLOW STATE" else if (completedSession) "SESSION FINISHED!" else "PAUSED",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = if (completedSession) EnergyQuickWin else IndigoPrimary,
                )
            }
        }

        // Timer Controls
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                // Reset
                IconButton(
                    onClick = {
                        isRunning = false
                        secondsRemaining = totalSeconds
                        completedSession = false
                    },
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.surfaceVariant),
                ) {
                    Icon(Icons.Filled.Refresh, contentDescription = "Reset timer")
                }

                // Play / Pause
                Button(
                    onClick = { isRunning = !isRunning },
                    shape = RoundedCornerShape(28.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = IndigoPrimary),
                    modifier = Modifier.height(56.dp).padding(horizontal = 8.dp),
                ) {
                    Icon(
                        imageVector = if (isRunning) Icons.Filled.Close else Icons.Filled.PlayArrow,
                        contentDescription = if (isRunning) "Pause" else "Start",
                    )
                    Spacer(Modifier.padding(horizontal = 4.dp))
                    Text(if (isRunning) "Pause" else "Start Focus", fontWeight = FontWeight.Bold)
                }

                // +5m Quick Add
                OutlinedButton(
                    onClick = {
                        totalSeconds += 300
                        secondsRemaining += 300
                    },
                    shape = RoundedCornerShape(20.dp),
                ) {
                    Text("+5m")
                }
            }

            // Complete Task button
            if (task != null) {
                Button(
                    onClick = {
                        onCompleteTask(task)
                        onClose()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EnergyQuickWin),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Icon(Icons.Filled.Check, contentDescription = null)
                    Spacer(Modifier.padding(horizontal = 4.dp))
                    Text("Mark Task as Done", fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
