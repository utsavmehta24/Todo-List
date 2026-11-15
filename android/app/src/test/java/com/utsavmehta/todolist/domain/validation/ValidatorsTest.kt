package com.utsavmehta.todolist.domain.validation

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ValidatorsTest {

    @Test
    fun normalizeEmail_trimsAndLowercases() {
        assertEquals("a@b.com", Validators.normalizeEmail("  A@B.Com "))
    }

    @Test
    fun validateName_rules() {
        assertEquals(ValidationMessages.NAME_REQUIRED, Validators.validateName(""))
        assertEquals(ValidationMessages.NAME_REQUIRED, Validators.validateName("   "))
        assertNull(Validators.validateName("A"))
        assertNull(Validators.validateName("a".repeat(Limits.NAME_MAX)))
        assertEquals(ValidationMessages.NAME_TOO_LONG, Validators.validateName("a".repeat(Limits.NAME_MAX + 1)))
        // Trimmed length is what counts.
        assertNull(Validators.validateName("  " + "a".repeat(Limits.NAME_MAX) + "  "))
    }

    @Test
    fun validateEmail_rules() {
        assertEquals(ValidationMessages.EMAIL_REQUIRED, Validators.validateEmail(""))
        assertEquals(ValidationMessages.EMAIL_REQUIRED, Validators.validateEmail("  "))
        assertEquals(ValidationMessages.EMAIL_INVALID, Validators.validateEmail("plain"))
        assertEquals(ValidationMessages.EMAIL_INVALID, Validators.validateEmail("a@b"))
        assertEquals(ValidationMessages.EMAIL_INVALID, Validators.validateEmail("a@b.c"))
        assertEquals(ValidationMessages.EMAIL_INVALID, Validators.validateEmail("@b.com"))
        assertEquals(ValidationMessages.EMAIL_INVALID, Validators.validateEmail("a b@c.com"))
        assertNull(Validators.validateEmail("user@example.com"))
        assertNull(Validators.validateEmail("  User.Name+tag@sub.example.org  "))
    }

    @Test
    fun validateNewPassword_rules() {
        assertEquals(ValidationMessages.PASSWORD_REQUIRED, Validators.validateNewPassword(""))
        assertEquals(ValidationMessages.PASSWORD_REQUIRED, Validators.validateNewPassword("   "))
        assertEquals(ValidationMessages.PASSWORD_TOO_SHORT, Validators.validateNewPassword("12345"))
        assertNull(Validators.validateNewPassword("123456"))
        assertNull(Validators.validateNewPassword("a long enough password"))
    }

    @Test
    fun validateLoginPassword_onlyRequiresNonBlank() {
        assertEquals(ValidationMessages.PASSWORD_REQUIRED, Validators.validateLoginPassword(""))
        assertEquals(ValidationMessages.PASSWORD_REQUIRED, Validators.validateLoginPassword("  "))
        assertNull(Validators.validateLoginPassword("1"))
    }

    @Test
    fun validateTaskTitle_rules() {
        assertEquals(ValidationMessages.TITLE_REQUIRED, Validators.validateTaskTitle(""))
        assertEquals(ValidationMessages.TITLE_REQUIRED, Validators.validateTaskTitle("   "))
        assertNull(Validators.validateTaskTitle("t"))
        assertNull(Validators.validateTaskTitle("t".repeat(Limits.TITLE_MAX)))
        assertEquals(ValidationMessages.TITLE_TOO_LONG, Validators.validateTaskTitle("t".repeat(Limits.TITLE_MAX + 1)))
    }

    @Test
    fun validateTaskDescription_rules() {
        assertEquals(ValidationMessages.DESCRIPTION_REQUIRED, Validators.validateTaskDescription(""))
        assertEquals(ValidationMessages.DESCRIPTION_REQUIRED, Validators.validateTaskDescription("  "))
        assertNull(Validators.validateTaskDescription("d"))
        assertNull(Validators.validateTaskDescription("d".repeat(Limits.TASK_DESCRIPTION_MAX)))
        assertEquals(
            ValidationMessages.DESCRIPTION_TOO_LONG,
            Validators.validateTaskDescription("d".repeat(Limits.TASK_DESCRIPTION_MAX + 1)),
        )
    }

    @Test
    fun validateRating_rules() {
        assertEquals(ValidationMessages.RATING_REQUIRED, Validators.validateRating(0))
        assertNull(Validators.validateRating(1))
        assertNull(Validators.validateRating(3))
        assertNull(Validators.validateRating(5))
        assertEquals(ValidationMessages.RATING_REQUIRED, Validators.validateRating(6))
        assertEquals(ValidationMessages.RATING_REQUIRED, Validators.validateRating(-1))
    }

    @Test
    fun validateReviewDescription_rules() {
        assertEquals(ValidationMessages.DESCRIPTION_REQUIRED, Validators.validateReviewDescription(""))
        assertEquals(ValidationMessages.DESCRIPTION_REQUIRED, Validators.validateReviewDescription("  "))
        assertNull(Validators.validateReviewDescription("d"))
        assertNull(Validators.validateReviewDescription("d".repeat(Limits.REVIEW_DESCRIPTION_MAX)))
        assertEquals(
            ValidationMessages.DESCRIPTION_TOO_LONG,
            Validators.validateReviewDescription("d".repeat(Limits.REVIEW_DESCRIPTION_MAX + 1)),
        )
    }
}
