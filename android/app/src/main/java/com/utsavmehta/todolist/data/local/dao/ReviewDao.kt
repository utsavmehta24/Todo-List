package com.utsavmehta.todolist.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.utsavmehta.todolist.data.local.entity.ReviewEntity
import com.utsavmehta.todolist.data.local.entity.ReviewWithAuthorRow
import kotlinx.coroutines.flow.Flow

@Dao
interface ReviewDao {

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insert(review: ReviewEntity): Long

    @Query(
        "SELECT r.id AS id, r.user_id AS user_id, u.name AS author_name, r.rating AS rating, " +
            "r.description AS description, r.added_date AS added_date FROM reviews r " +
            "INNER JOIN users u ON u.id = r.user_id ORDER BY r.added_date DESC, r.id DESC",
    )
    fun observeAllWithAuthor(): Flow<List<ReviewWithAuthorRow>>
}
