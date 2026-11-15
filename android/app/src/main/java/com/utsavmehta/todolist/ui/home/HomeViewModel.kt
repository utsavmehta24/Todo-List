package com.utsavmehta.todolist.ui.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.utsavmehta.todolist.data.repository.QuoteRepository
import com.utsavmehta.todolist.domain.model.Quote
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn

data class HomeUiState(val quote: Quote? = null)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val quoteRepository: QuoteRepository,
) : ViewModel() {

    val uiState: StateFlow<HomeUiState> = quoteRepository
        .rotatingQuotes(QuoteRepository.ROTATION_INTERVAL_MS)
        .map { HomeUiState(quote = it) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), HomeUiState())
}
