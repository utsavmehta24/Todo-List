package com.utsavmehta.todolist.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodoTopBar(
    title: String,
    canNavigateBack: Boolean,
    isLoggedIn: Boolean,
    onNavigateBack: () -> Unit,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit,
) {
    var menuExpanded by remember { mutableStateOf(false) }

    TopAppBar(
        title = { Text(title) },
        navigationIcon = {
            if (canNavigateBack) {
                IconButton(onClick = onNavigateBack) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
            }
        },
        actions = {
            IconButton(onClick = { menuExpanded = true }) {
                Icon(Icons.Filled.MoreVert, contentDescription = "Menu")
            }
            DropdownMenu(expanded = menuExpanded, onDismissRequest = { menuExpanded = false }) {
                @Composable
                fun Item(label: String, route: String) {
                    DropdownMenuItem(
                        text = { Text(label) },
                        onClick = {
                            menuExpanded = false
                            onNavigate(route)
                        },
                    )
                }
                Item("Home", Routes.HOME)
                Item("Reviews", Routes.REVIEWS)
                if (isLoggedIn) {
                    Item("Dashboard", Routes.DASHBOARD)
                    Item("My Tasks", Routes.TASKS)
                    Item("Write a Review", Routes.WRITE_REVIEW)
                    DropdownMenuItem(
                        text = { Text("Log out") },
                        onClick = {
                            menuExpanded = false
                            onLogout()
                        },
                    )
                } else {
                    Item("Log in", Routes.LOGIN)
                    Item("Sign up", Routes.SIGNUP)
                }
            }
        },
    )
}
