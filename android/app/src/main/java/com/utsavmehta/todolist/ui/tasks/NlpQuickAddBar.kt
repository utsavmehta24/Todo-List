package com.utsavmehta.todolist.ui.tasks

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.utsavmehta.todolist.domain.model.Energy
import com.utsavmehta.todolist.domain.model.Priority
import com.utsavmehta.todolist.domain.parser.NlpParser
import com.utsavmehta.todolist.domain.parser.ParsedTaskInput
import com.utsavmehta.todolist.ui.theme.EnergyQuickWin
import com.utsavmehta.todolist.ui.theme.IndigoPrimary
import com.utsavmehta.todolist.ui.theme.PriorityHigh
import com.utsavmehta.todolist.ui.theme.PriorityUrgent

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun NlpQuickAddBar(
    onAddTask: (ParsedTaskInput) -> Unit,
    modifier: Modifier = Modifier,
) {
    var rawText by remember { mutableStateOf("") }
    val parsed = remember(rawText) { NlpParser.parse(rawText) }

    fun submit() {
        if (rawText.isNotBlank()) {
            onAddTask(parsed)
            rawText = ""
        }
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                OutlinedTextField(
                    value = rawText,
                    onValueChange = { rawText = it },
                    placeholder = {
                        Text(
                            "Finish notes tomorrow #study !urgent @quick ~20m",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f),
                        )
                    },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = IndigoPrimary,
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                    ),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    keyboardActions = KeyboardActions(onDone = { submit() }),
                )

                Spacer(Modifier.padding(horizontal = 4.dp))

                IconButton(
                    onClick = { submit() },
                    enabled = rawText.isNotBlank(),
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (rawText.isNotBlank()) IndigoPrimary else MaterialTheme.colorScheme.surfaceVariant),
                ) {
                    Icon(
                        imageVector = Icons.Filled.Add,
                        contentDescription = "Add task",
                        tint = if (rawText.isNotBlank()) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            // Live parsed badges preview
            if (rawText.isNotBlank() && (parsed.tags.isNotEmpty() || parsed.priority != Priority.MEDIUM || parsed.energy != Energy.MEDIUM || parsed.dueDate != null || parsed.estimatedMinutes != 25)) {
                Spacer(Modifier.height(8.dp))
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    parsed.tags.forEach { tag ->
                        BadgeChip(label = "#$tag", color = IndigoPrimary)
                    }
                    if (parsed.priority == Priority.URGENT || parsed.priority == Priority.HIGH) {
                        BadgeChip(label = "!${parsed.priority.label}", color = if (parsed.priority == Priority.URGENT) PriorityUrgent else PriorityHigh)
                    }
                    if (parsed.energy != Energy.MEDIUM) {
                        BadgeChip(label = "${parsed.energy.emoji} ${parsed.energy.label}", color = EnergyQuickWin)
                    }
                    if (parsed.estimatedMinutes != 25) {
                        BadgeChip(label = "~${parsed.estimatedMinutes}m", color = MaterialTheme.colorScheme.secondary)
                    }
                    if (parsed.dueDate != null) {
                        BadgeChip(label = "📅 Due scheduled", color = MaterialTheme.colorScheme.tertiary)
                    }
                }
            }
        }
    }
}

@Composable
fun BadgeChip(label: String, color: Color) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = color.copy(alpha = 0.15f),
    ) {
        Text(
            text = label,
            color = color,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
        )
    }
}
