package com.utsavmehta.todolist.data.repository

import android.content.Context
import com.utsavmehta.todolist.domain.model.Quote
import dagger.hilt.android.qualifiers.ApplicationContext
import java.io.IOException
import javax.inject.Inject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import kotlin.random.Random

private const val QUOTES_ASSET = "quotes.json"
private val FALLBACK_QUOTE = Quote(text = "Stay focused and keep going.", author = "Unknown")

/**
 * Loads motivational quotes from the bundled `assets/quotes.json` file.
 *
 * The file is parsed once and cached in memory. Malformed or empty content
 * falls back to a single built-in quote so callers never receive an empty list.
 */
class QuoteRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
) : QuoteRepository {

    private val mutex = Mutex()
    private var cache: List<Quote>? = null

    override suspend fun getQuotes(): List<Quote> = mutex.withLock {
        cache ?: loadQuotes().also { cache = it }
    }

    override fun rotatingQuotes(intervalMillis: Long): Flow<Quote> = flow {
        val quotes = getQuotes()
        var current = quotes[Random.nextInt(quotes.size)]
        emit(current)
        while (true) {
            delay(intervalMillis)
            current = nextQuote(quotes, previous = current)
            emit(current)
        }
    }

    private suspend fun loadQuotes(): List<Quote> = withContext(Dispatchers.IO) {
        val parsed = try {
            val raw = context.assets.open(QUOTES_ASSET).bufferedReader().use { it.readText() }
            parseQuotes(raw)
        } catch (e: JSONException) {
            emptyList()
        } catch (e: IOException) {
            emptyList()
        }
        parsed.ifEmpty { listOf(FALLBACK_QUOTE) }
    }

    private fun parseQuotes(raw: String): List<Quote> {
        val array = JSONArray(raw)
        val quotes = ArrayList<Quote>(array.length())
        for (index in 0 until array.length()) {
            val item: JSONObject = array.optJSONObject(index) ?: continue
            val text = item.optString("text").trim()
            if (text.isEmpty()) continue
            val author = item.optString("author")
                .split(',')[0]
                .trim()
                .ifBlank { "Unknown" }
            quotes += Quote(text = text, author = author)
        }
        return quotes
    }

    /** Picks a random quote that differs from [previous] whenever more than one exists. */
    private fun nextQuote(quotes: List<Quote>, previous: Quote): Quote {
        if (quotes.size <= 1) return quotes.first()
        var candidate = quotes[Random.nextInt(quotes.size)]
        while (candidate == previous) {
            candidate = quotes[Random.nextInt(quotes.size)]
        }
        return candidate
    }
}
