package com.utsavmehta.todolist.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.AuthRepository
import com.utsavmehta.todolist.data.repository.QuoteRepository
import com.utsavmehta.todolist.data.repository.TaskRepository
import com.utsavmehta.todolist.domain.model.Quote
import com.utsavmehta.todolist.domain.model.TaskStats
import com.utsavmehta.todolist.domain.model.User
import dagger.hilt.android.lifecycle.HiltViewModel
import java.time.LocalTime
import javax.inject.Inject
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

data class DashboardUiState(
    val userName: String = "",
    val greeting: String = "",
    val stats: TaskStats = TaskStats(),
    val quote: Quote? = null,
    val isLoading: Boolean = true,
)

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val taskRepository: TaskRepository,
    private val quoteRepository: QuoteRepository,
) : ViewModel() {

    private val userAndStats: Flow<Pair<User?, TaskStats>> =
        authRepository.currentUser.flatMapLatest<User?, Pair<User?, TaskStats>> { user ->
            if (user == null) {
                flowOf(null to TaskStats())
            } else {
                taskRepository.observeTaskStats(user.id).map { stats -> user to stats }
            }
        }

    private val quoteFlow: Flow<Quote> =
        quoteRepository.rotatingQuotes(QuoteRepository.ROTATION_INTERVAL_MS)

    val uiState: StateFlow<DashboardUiState> = combine(userAndStats, quoteFlow) { userAndStatsPair, quote ->
        val (user, stats) = userAndStatsPair
        DashboardUiState(
            userName = user?.name.orEmpty(),
            greeting = greetingFor(LocalTime.now().hour, user?.name.orEmpty()),
            stats = stats,
            quote = quote,
            isLoading = false,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), DashboardUiState())
}

/** Builds the greeting for the given hour of day (0-23), omitting the name when blank. */
private fun greetingFor(hour: Int, name: String): String {
    val prefix = when {
        hour < 12 -> "Good morning"
        hour < 17 -> "Good afternoon"
        else -> "Good evening"
    }
    return if (name.isBlank()) prefix else "$prefix, $name"
}
