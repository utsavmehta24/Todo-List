package com.utsavmehta.todolist

import androidx.compose.ui.test.SemanticsMatcher
import androidx.compose.ui.test.hasClickAction
import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.printToString
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollTo
import androidx.compose.ui.test.performTextInput
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/**
 * Launches the real app (Hilt, Room, DataStore, Compose navigation) under Robolectric and drives
 * the main user journey end to end: signup, login, add a task, see it listed, write a review.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [34], qualifiers = "w411dp-h891dp-xxhdpi")
class AppSmokeTest {

    @get:Rule
    val rule = createAndroidComposeRule<MainActivity>()

    private fun waitFor(matcher: SemanticsMatcher) {
        try {
            rule.waitUntil(timeoutMillis = 15_000) {
                rule.onAllNodes(matcher).fetchSemanticsNodes().isNotEmpty()
            }
        } catch (e: Throwable) {
            println("SEMANTICS TREE:\n" + rule.onRoot().printToString(maxDepth = 50))
            throw e
        }
    }

    private fun click(matcher: SemanticsMatcher) {
        waitFor(matcher)
        rule.waitForIdle()
        rule.onAllNodes(matcher).onFirst().performScrollTo().performClick()
        rule.waitForIdle()
    }

    private fun type(label: String, value: String) {
        val field = hasSetTextAction() and hasText(label)
        waitFor(field)
        rule.onAllNodes(field).onFirst().performScrollTo().performTextInput(value)
    }

    private fun button(text: String) = hasText(text) and hasClickAction()

    @Test
    fun signupLoginAddTaskAndWriteReview() {
        // Home screen
        click(button("Get started"))

        // Signup
        type("Name", "Test User")
        type("Email", "test@example.com")
        type("Password", "secret123")
        click(button("Create account"))

        // Login (signup routes here)
        waitFor(hasText("Account created. Please log in."))
        type("Email", "test@example.com")
        type("Password", "secret123")
        click(button("Log in"))

        // Dashboard -> add a task
        waitFor(hasText("Quick actions"))
        click(button("Create New Task"))
        type("Title", "Buy groceries")
        type("Description", "Milk, eggs, bread")
        click(button("Add task"))

        // Back on dashboard -> task list shows the new task
        waitFor(hasText("Quick actions"))
        click(button("My Tasks"))
        waitFor(hasText("Buy groceries"))
        waitFor(hasText("Milk, eggs, bread"))
        rule.runOnUiThread { rule.activity.onBackPressedDispatcher.onBackPressed() }
        rule.waitForIdle()

        // Write a review
        click(button("Write a Review"))
        click(hasContentDescription("4 stars") and hasClickAction())
        type("Description", "Great little app")
        click(button("Submit review"))

        // Review list shows it
        waitFor(hasText("Quick actions"))
        click(button("Reviews"))
        waitFor(hasText("Great little app"))
    }
}
