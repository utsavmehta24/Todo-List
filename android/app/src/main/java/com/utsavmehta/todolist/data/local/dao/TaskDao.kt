package com.utsavmehta.todolist.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.utsavmehta.todolist.data.local.entity.TaskEntity
import com.utsavmehta.todolist.data.local.entity.TaskStatsRow
import kotlinx.coroutines.flow.Flow

@Dao
interface TaskDao {

    @Query("SELECT * FROM tasks WHERE user_id = :userId ORDER BY added_date DESC, id DESC")
    fun observeForUser(userId: Long): Flow<List<TaskEntity>>

    @Query(
        "SELECT COUNT(*) AS total, " +
            "COALESCE(SUM(CASE WHEN status != 'completed' THEN 1 ELSE 0 END), 0) AS pending, " +
            "COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed " +
            "FROM tasks WHERE user_id = :userId",
    )
    fun observeStats(userId: Long): Flow<TaskStatsRow>

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insert(task: TaskEntity): Long

    @Update
    suspend fun update(task: TaskEntity): Int

    @Query("UPDATE tasks SET status = :status WHERE id = :taskId AND user_id = :userId")
    suspend fun updateStatus(taskId: Long, userId: Long, status: String): Int

    @Query("DELETE FROM tasks WHERE id = :taskId AND user_id = :userId")
    suspend fun delete(taskId: Long, userId: Long): Int
}
