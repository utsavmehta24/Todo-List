package com.utsavmehta.todolist.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.utsavmehta.todolist.MainActivity
import com.utsavmehta.todolist.R

/**
 * TaskFlow Home Screen AppWidget
 * Built by Utsav
 * Displays current flow status and provides 1-tap instant entry to TaskFlow.
 */
class TaskFlowWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val views = RemoteViews(context.packageName, R.layout.widget_taskflow).apply {
                setOnClickPendingIntent(R.id.widget_root, pendingIntent)
                setOnClickPendingIntent(R.id.widget_btn_open, pendingIntent)
                setTextViewText(R.id.widget_task_title, "⚡ Tap to capture with NLP or start Pomodoro Focus.")
            }

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
