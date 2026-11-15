package com.utsavmehta.todolist.data.local.session

import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.longPreferencesKey
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.map

/** Persists the id of the logged-in user. The session survives process death and has no expiry. */
@Singleton
class SessionManager @Inject constructor(
    private val dataStore: DataStore<Preferences>,
) {
    val currentUserId: Flow<Long?> = dataStore.data
        .catch { e ->
            if (e is IOException) emit(emptyPreferences()) else throw e
        }
        .map { it[KEY_USER_ID] }
        .distinctUntilChanged()

    suspend fun startSession(userId: Long) {
        dataStore.edit {
            it[KEY_USER_ID] = userId
            it[KEY_LOGGED_IN_AT] = System.currentTimeMillis()
        }
    }

    suspend fun clearSession() {
        dataStore.edit { it.clear() }
    }

    private companion object {
        val KEY_USER_ID = longPreferencesKey("current_user_id")
        val KEY_LOGGED_IN_AT = longPreferencesKey("logged_in_at")
    }
}
