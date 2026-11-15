# Todo-List Android — Architecture Spec (v1)

Local-first native port of the Next.js app. No backend, no INTERNET permission. Gradle root: `android/`.
Package root `com.utsavmehta.todolist` (abbrev. `ttl` below = `com/utsavmehta/todolist`). Single `:app` module.
Nothing is compile-verified here: **every signature in this file is a contract. Do not rename, reorder params, or change types.**

## 1. Global conventions (all work packages)
- Kotlin 2.0.21, JVM target 17 via `kotlin { jvmToolchain(17) }`. No `kotlinx.serialization`, no Gson/Moshi (quotes parsed with `org.json`).
- MVVM + UDF: each screen = `XScreen` composable + `@HiltViewModel class XViewModel @Inject constructor(...) : ViewModel()`.
  ViewModel exposes exactly one `val uiState: StateFlow<XUiState>`; UiState is an immutable `data class` declared **in the ViewModel file**.
  Screens read it with `val state by viewModel.uiState.collectAsStateWithLifecycle()` (`androidx.lifecycle.compose`).
  Form VMs: `private val _uiState = MutableStateFlow(XUiState())` + `_uiState.update { }`. Observing VMs: `.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), XUiState())`.
- Every screen signature ends with `modifier: Modifier = Modifier, viewModel: XViewModel = hiltViewModel()` (import `androidx.hilt.navigation.compose.hiltViewModel`).
- One-shot events = boolean/String? field in UiState + a `fun onXHandled()` consume method on the VM. No Channels/SharedFlow.
- Transient messages: field `userMessage: String?` + `fun onUserMessageShown()`; screen shows it via `LocalSnackbarHostState.current` in `LaunchedEffect(state.userMessage)`.
- `flatMapLatest` needs `@OptIn(ExperimentalCoroutinesApi::class)` on the class.
- VMs NEVER inject `SessionManager` or DAOs. Current user = `authRepository.currentUser` (Flow) / `authRepository.currentUser.first()` (one-shot).
- User-facing copy is Kotlin string literals (English). Only `app_name` lives in `strings.xml` (avoids R-reference drift across WPs).
- Icons: only `androidx.compose.material.icons` **core** set (e.g. `Icons.Filled.Star, Add, Delete, Check, CheckCircle, Home, Person, Lock, Email, MoreVert, Info, Edit, List, Refresh`, `Icons.AutoMirrored.Filled.ArrowBack, ExitToApp, List`). No `material-icons-extended`.
- Dates: `Long` epoch millis everywhere; format only via `formatDate()` (components).
- Repos return `AppResult<T>`; Room suspend calls are main-safe; CPU work (PBKDF2) uses `withContext(Dispatchers.Default)`, asset IO uses `Dispatchers.IO`.

## 2. Package structure (under `app/src/main/java/ttl/`)
```
TodoApplication.kt, MainActivity.kt
data/local/            TodoDatabase.kt
data/local/entity/     UserEntity, TaskEntity, ReviewEntity, TaskStatsRow, ReviewWithAuthorRow, EntityMappers
data/local/dao/        UserDao, TaskDao, ReviewDao
data/local/session/    SessionManager
data/local/security/   PasswordHasher
data/repository/       AuthRepository(+Impl), TaskRepository(+Impl), ReviewRepository(+Impl), QuoteRepository(+Impl)
domain/model/          User, Task, TaskStatus, TaskStats, Review, Quote, AppResult, SessionState
domain/validation/     Validators (+ ValidationMessages, Limits)
di/                    DatabaseModule, DataStoreModule, RepositoryModule
ui/theme/              Color, Type, Theme
ui/components/         FormTextField, LoadingButton, LoadingIndicator, EmptyState, SnackbarHost(Local), DateFormat
ui/navigation/         Routes, NavigationActions, AuthGuards, SessionViewModel, TodoTopBar, TodoNavHost, TodoApp
ui/auth/ ui/tasks/ ui/reviews/ ui/dashboard/ ui/home/   feature screens + VMs
```

## 3. Domain models (`domain.model`) — SCAFFOLD
```kotlin
data class User(val id: Long, val name: String, val email: String)
enum class TaskStatus(val storageValue: String, val label: String) {
    PENDING("pending", "Pending"), COMPLETED("completed", "Completed");
    fun toggled(): TaskStatus = if (this == PENDING) COMPLETED else PENDING
    companion object { fun fromStorage(value: String): TaskStatus = entries.firstOrNull { it.storageValue == value } ?: PENDING }
}
data class Task(val id: Long, val userId: Long, val title: String, val description: String, val status: TaskStatus, val addedDate: Long)
data class TaskStats(val total: Int = 0, val pending: Int = 0, val completed: Int = 0)
data class Review(val id: Long, val userId: Long, val authorName: String, val rating: Int, val description: String, val addedDate: Long)
data class Quote(val text: String, val author: String)
enum class FormField { NAME, EMAIL, PASSWORD, TITLE, DESCRIPTION, RATING }
sealed interface AppResult<out T> {
    data class Success<out T>(val data: T) : AppResult<T>
    data class Error(val message: String, val field: FormField? = null) : AppResult<Nothing>
}
sealed interface SessionState {
    data object Loading : SessionState
    data object LoggedOut : SessionState
    data class LoggedIn(val user: User) : SessionState
}
```
(`FormField` and `AppResult` share file `AppResult.kt`.)

## 4. Validation (`domain.validation.Validators.kt`) — SCAFFOLD
Each validator returns `null` if valid else the message. Repos re-validate (authoritative); VMs call the same functions on submit for field errors.
```kotlin
object Limits { const val NAME_MAX = 50; const val PASSWORD_MIN = 6; const val TITLE_MAX = 100
                const val TASK_DESCRIPTION_MAX = 1000; const val REVIEW_DESCRIPTION_MAX = 500 }
object ValidationMessages {
    const val NAME_REQUIRED = "Please Enter Your Name";      const val NAME_TOO_LONG = "Name must be at most 50 characters"
    const val EMAIL_REQUIRED = "Please Enter Your Email";    const val EMAIL_INVALID = "Please enter a valid email address"
    const val EMAIL_TAKEN = "An account with this email already exists"
    const val PASSWORD_REQUIRED = "Please Enter Your Password"; const val PASSWORD_TOO_SHORT = "Password must be at least 6 characters"
    const val INVALID_CREDENTIALS = "Invalid email or password"
    const val TITLE_REQUIRED = "Title is required";           const val TITLE_TOO_LONG = "Title must be at most 100 characters"
    const val DESCRIPTION_REQUIRED = "Description is required"
    const val DESCRIPTION_TOO_LONG = "Description is too long"
    const val RATING_REQUIRED = "Please select a rating between 1 and 5"
    const val TASK_NOT_FOUND = "Task not found"
    const val NOT_LOGGED_IN = "You must be logged in"
    const val GENERIC = "Something went wrong"
}
object Validators {
    private val EMAIL_REGEX = Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")
    fun normalizeEmail(email: String): String = email.trim().lowercase(java.util.Locale.ROOT)
    fun validateName(name: String): String?               // blank->NAME_REQUIRED; trimmed > NAME_MAX -> NAME_TOO_LONG
    fun validateEmail(email: String): String?             // blank->EMAIL_REQUIRED; !EMAIL_REGEX.matches(trim) -> EMAIL_INVALID
    fun validateNewPassword(password: String): String?    // signup: blank->PASSWORD_REQUIRED; length < PASSWORD_MIN -> TOO_SHORT (not trimmed)
    fun validateLoginPassword(password: String): String?  // login: blank->PASSWORD_REQUIRED only
    fun validateTaskTitle(title: String): String?         // blank->TITLE_REQUIRED; trimmed > TITLE_MAX -> TITLE_TOO_LONG
    fun validateTaskDescription(description: String): String?  // blank->DESCRIPTION_REQUIRED; > TASK_DESCRIPTION_MAX -> TOO_LONG
    fun validateRating(rating: Int): String?              // rating !in 1..5 -> RATING_REQUIRED
    fun validateReviewDescription(description: String): String? // blank->REQUIRED; > REVIEW_DESCRIPTION_MAX -> TOO_LONG
}
```
Parity notes: web required name/email/password, unique email, task title+description+status required, review rating 1-5 + description required. Added hardening: email format, password min 6 (signup only), max lengths.

## 5. Room schema (`data.local.entity`) — SCAFFOLD
DB file `todo.db`, `version = 1`, `exportSchema = false`, no migrations (`fallbackToDestructiveMigration()` NOT used). Foreign keys enforced (Room emits `PRAGMA foreign_keys=ON`).
```kotlin
@Entity(tableName = "users", indices = [Index(value = ["email"], unique = true)])
data class UserEntity(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "id") val id: Long = 0,
    @ColumnInfo(name = "name") val name: String,
    @ColumnInfo(name = "email") val email: String,                 // always Validators.normalizeEmail()
    @ColumnInfo(name = "password_hash") val passwordHash: String,  // PasswordHasher encoded string (includes salt)
    @ColumnInfo(name = "created_at") val createdAt: Long)

@Entity(tableName = "tasks",
    foreignKeys = [ForeignKey(entity = UserEntity::class, parentColumns = ["id"], childColumns = ["user_id"], onDelete = ForeignKey.CASCADE)],
    indices = [Index(value = ["user_id"]), Index(value = ["user_id", "status"])])
data class TaskEntity(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "id") val id: Long = 0,
    @ColumnInfo(name = "user_id") val userId: Long,
    @ColumnInfo(name = "title") val title: String,
    @ColumnInfo(name = "description") val description: String,
    @ColumnInfo(name = "status") val status: String,               // TaskStatus.storageValue: "pending" | "completed"
    @ColumnInfo(name = "added_date") val addedDate: Long)

@Entity(tableName = "reviews",
    foreignKeys = [ForeignKey(entity = UserEntity::class, parentColumns = ["id"], childColumns = ["user_id"], onDelete = ForeignKey.CASCADE)],
    indices = [Index(value = ["user_id"]), Index(value = ["added_date"])])
data class ReviewEntity(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "id") val id: Long = 0,
    @ColumnInfo(name = "user_id") val userId: Long,
    @ColumnInfo(name = "rating") val rating: Int,                  // 1..5, enforced in Validators
    @ColumnInfo(name = "description") val description: String,
    @ColumnInfo(name = "added_date") val addedDate: Long)

data class TaskStatsRow(@ColumnInfo(name = "total") val total: Int, @ColumnInfo(name = "pending") val pending: Int,
                        @ColumnInfo(name = "completed") val completed: Int)
data class ReviewWithAuthorRow(@ColumnInfo(name = "id") val id: Long, @ColumnInfo(name = "user_id") val userId: Long,
    @ColumnInfo(name = "author_name") val authorName: String, @ColumnInfo(name = "rating") val rating: Int,
    @ColumnInfo(name = "description") val description: String, @ColumnInfo(name = "added_date") val addedDate: Long)
```
`EntityMappers.kt`: `fun UserEntity.toDomain(): User`, `fun TaskEntity.toDomain(): Task` (uses `TaskStatus.fromStorage`), `fun TaskStatsRow.toDomain(): TaskStats`, `fun ReviewWithAuthorRow.toDomain(): Review`.

`TodoDatabase.kt`:
```kotlin
@Database(entities = [UserEntity::class, TaskEntity::class, ReviewEntity::class], version = 1, exportSchema = false)
abstract class TodoDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao; abstract fun taskDao(): TaskDao; abstract fun reviewDao(): ReviewDao
    companion object { const val NAME = "todo.db" } }
```

## 6. DAOs (`data.local.dao`) — exact
```kotlin
@Dao interface UserDao {                                                   // WP1
    @Insert(onConflict = OnConflictStrategy.ABORT) suspend fun insert(user: UserEntity): Long
    @Query("SELECT * FROM users WHERE email = :email LIMIT 1") suspend fun findByEmail(email: String): UserEntity?
    @Query("SELECT EXISTS(SELECT 1 FROM users WHERE email = :email)") suspend fun emailExists(email: String): Boolean
    @Query("SELECT * FROM users WHERE id = :id LIMIT 1") fun observeById(id: Long): Flow<UserEntity?>
}
@Dao interface TaskDao {                                                   // WP2
    @Query("SELECT * FROM tasks WHERE user_id = :userId ORDER BY added_date DESC, id DESC")
    fun observeForUser(userId: Long): Flow<List<TaskEntity>>
    @Query("SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pending, " +
           "COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed FROM tasks WHERE user_id = :userId")
    fun observeStats(userId: Long): Flow<TaskStatsRow>
    @Insert(onConflict = OnConflictStrategy.ABORT) suspend fun insert(task: TaskEntity): Long
    @Query("UPDATE tasks SET status = :status WHERE id = :taskId AND user_id = :userId")
    suspend fun updateStatus(taskId: Long, userId: Long, status: String): Int   // rows affected
    @Query("DELETE FROM tasks WHERE id = :taskId AND user_id = :userId")
    suspend fun delete(taskId: Long, userId: Long): Int                         // rows affected
}
@Dao interface ReviewDao {                                                 // WP3
    @Insert(onConflict = OnConflictStrategy.ABORT) suspend fun insert(review: ReviewEntity): Long
    @Query("SELECT r.id AS id, r.user_id AS user_id, u.name AS author_name, r.rating AS rating, " +
           "r.description AS description, r.added_date AS added_date FROM reviews r " +
           "INNER JOIN users u ON u.id = r.user_id ORDER BY r.added_date DESC, r.id DESC")
    fun observeAllWithAuthor(): Flow<List<ReviewWithAuthorRow>>
}
```
`Flow` = `kotlinx.coroutines.flow.Flow`. All writes are scoped by `user_id` so a user can never mutate another user's task.

## 7. Session + password hashing
**SessionManager** (`data.local.session`, SCAFFOLD) — DataStore Preferences, single instance from `DataStoreModule`:
```kotlin
@Singleton class SessionManager @Inject constructor(private val dataStore: DataStore<Preferences>) {
    val currentUserId: Flow<Long?>   // dataStore.data.catch{ IOException -> emit(emptyPreferences()) else rethrow }.map{ it[KEY_USER_ID] }.distinctUntilChanged()
    suspend fun startSession(userId: Long)   // edit { KEY_USER_ID = userId; KEY_LOGGED_IN_AT = System.currentTimeMillis() }
    suspend fun clearSession()               // edit { it.clear() }
    private companion object { val KEY_USER_ID = longPreferencesKey("current_user_id"); val KEY_LOGGED_IN_AT = longPreferencesKey("logged_in_at") }
}
```
DataStore built with `PreferenceDataStoreFactory.create(produceFile = { context.preferencesDataStoreFile("session") })` (never the `by preferencesDataStore` delegate). Session persists across process death; no expiry (web JWT had none effective client-side).

**PasswordHasher** (`data.local.security`, WP1): `@Singleton class PasswordHasher @Inject constructor()`
- `fun hash(password: String): String` — 16-byte `SecureRandom` salt, `PBKDF2WithHmacSHA256` (available API 26+), 120_000 iterations, 256-bit key. Encoded `"pbkdf2_sha256$<iterations>$<b64 salt>$<b64 hash>"` using `java.util.Base64.getEncoder()` (no padding stripping).
- `fun verify(password: String, encoded: String): Boolean` — parse the 4 parts (return false on malformed), recompute with stored iterations, compare with `MessageDigest.isEqual`. Clear `PBEKeySpec` via `clearPassword()`.

## 8. Repositories (`data.repository`) — interfaces SCAFFOLD, `*Impl` per WP
All impls: `class XRepositoryImpl @Inject constructor(...) : XRepository`, bound `@Singleton` in `RepositoryModule`.
```kotlin
interface AuthRepository {                                    // Impl(WP1): UserDao, SessionManager, PasswordHasher
    val currentUser: Flow<User?>
    suspend fun signUp(name: String, email: String, password: String): AppResult<User>
    suspend fun login(email: String, password: String): AppResult<User>
    suspend fun logout()
}
interface TaskRepository {                                    // Impl(WP2): TaskDao
    fun observeTasks(userId: Long): Flow<List<Task>>
    fun observeTaskStats(userId: Long): Flow<TaskStats>
    suspend fun addTask(userId: Long, title: String, description: String, status: TaskStatus): AppResult<Task>
    suspend fun updateStatus(taskId: Long, userId: Long, status: TaskStatus): AppResult<Unit>
    suspend fun deleteTask(taskId: Long, userId: Long): AppResult<Unit>
}
interface ReviewRepository {                                  // Impl(WP3): ReviewDao, UserDao-free (join in SQL)
    fun observeReviews(): Flow<List<Review>>
    suspend fun addReview(userId: Long, rating: Int, description: String): AppResult<Review>
}
interface QuoteRepository {                                   // Impl(WP4): @ApplicationContext Context
    suspend fun getQuotes(): List<Quote>
    fun rotatingQuotes(intervalMillis: Long): Flow<Quote>
    companion object { const val ROTATION_INTERVAL_MS = 5_000L }
}
```
Behavior contracts:
- `currentUser` = `sessionManager.currentUserId.flatMapLatest { id -> if (id == null) flowOf(null) else userDao.observeById(id).map { it?.toDomain() } }.distinctUntilChanged()`. Stale id (user row gone) yields `null` = logged out.
- `signUp`: validate name/email/newPassword (first failure -> `Error(msg, field)`), `email = normalizeEmail`, `emailExists` -> `Error(EMAIL_TAKEN, EMAIL)`, hash on `Dispatchers.Default`, insert (catch `SQLiteConstraintException` -> `EMAIL_TAKEN`), name stored trimmed. **Does NOT start a session** (web parity: signup then login). Returns created `User`.
- `login`: validate email/loginPassword; `findByEmail(normalized)`; missing user or bad password -> `Error(INVALID_CREDENTIALS)` (field null, no user enumeration); success -> `sessionManager.startSession(id)`.
- `logout` -> `sessionManager.clearSession()`.
- `addTask`: validate title/description, trim both, `addedDate = System.currentTimeMillis()`, return mapped `Task` with generated id.
- `updateStatus`/`deleteTask`: 0 rows -> `Error(TASK_NOT_FOUND)`. Any unexpected exception in any repo -> `Error(GENERIC)` (catch `Exception`, rethrow `CancellationException`).
- `addReview`: validate rating/description, trim, insert; return `Review` (authorName may be "" in the returned object; list is the source of truth).
- `QuoteRepositoryImpl`: reads `assets/quotes.json` (array of `{text, author}`) via `context.assets.open` + `org.json.JSONArray` on `Dispatchers.IO`, caches in memory (Mutex). Author cleaned: `author.split(',')[0].trim().ifBlank { "Unknown" }`. Malformed/empty asset -> single fallback `Quote("Stay focused and keep going.", "Unknown")`. `rotatingQuotes` = `flow { emit random; loop { delay(interval); emit random != previous (when size>1) } }`.

## 9. DI (`di`) — SCAFFOLD, all `@Module @InstallIn(SingletonComponent::class)`
- `DatabaseModule` (object): `@Provides @Singleton fun provideDatabase(@ApplicationContext context: Context): TodoDatabase = Room.databaseBuilder(context, TodoDatabase::class.java, TodoDatabase.NAME).build()`; `@Provides fun provideUserDao(db: TodoDatabase): UserDao`, same for `TaskDao`, `ReviewDao`.
- `DataStoreModule` (object): `@Provides @Singleton fun provideSessionDataStore(@ApplicationContext context: Context): DataStore<Preferences>`.
- `RepositoryModule` (abstract class): `@Binds @Singleton abstract fun bindAuthRepository(impl: AuthRepositoryImpl): AuthRepository` + same for Task/Review/Quote.
`PasswordHasher`, `SessionManager` are constructor-injected (`@Singleton` + `@Inject constructor`).

## 10. Navigation (`ui.navigation`) — SCAFFOLD
String routes (no type-safe/serialization routes).
```kotlin
object Routes { const val HOME = "home"; const val LOGIN = "login"; const val SIGNUP = "signup"; const val DASHBOARD = "dashboard"
    const val TASKS = "tasks"; const val ADD_TASK = "tasks/add"; const val REVIEWS = "reviews"; const val WRITE_REVIEW = "reviews/write"
    fun titleFor(route: String?): String  // Home->"TodoList", Login->"Log in", Signup->"Sign up", Dashboard->"Dashboard", Tasks->"My Tasks",
}                                         // AddTask->"Add Task", Reviews->"Reviews", WriteReview->"Write a Review", else "TodoList"
```
| Route | Access | Screen |
|---|---|---|
| home (start) | public | HomeScreen |
| login, signup | guest-only (GuestGuard) | LoginScreen, SignupScreen |
| dashboard, tasks, tasks/add, reviews/write | auth (AuthGuard) | DashboardScreen, TasksScreen, AddTaskScreen, WriteReviewScreen |
| reviews | public | ReviewsScreen |

`NavigationActions.kt` (extensions on `NavHostController`):
`navigateToLogin()` = navigate(LOGIN){ popUpTo(HOME); launchSingleTop = true } · `navigateToDashboard()` = navigate(DASHBOARD){ popUpTo(HOME); launchSingleTop = true } · `navigateHomeClearingBackStack()` = navigate(HOME){ popUpTo(graph.id){ inclusive = true }; launchSingleTop = true } · `navigateSingleTop(route: String)`.

`SessionViewModel` (`@HiltViewModel`, injects `AuthRepository`): `val sessionState: StateFlow<SessionState>` = `currentUser.map{ null->LoggedOut / LoggedIn(it) }.stateIn(viewModelScope, SharingStarted.Eagerly, SessionState.Loading)`; `fun logout()`.

`AuthGuards.kt` — guarding strategy: **session is the single source of truth; screens never navigate on login/logout themselves.**
```kotlin
@Composable fun AuthGuard(sessionState: SessionState, onUnauthenticated: () -> Unit, content: @Composable (User) -> Unit)
// Loading -> FullScreenLoading(); LoggedOut -> LaunchedEffect(Unit){ onUnauthenticated() } + FullScreenLoading(); LoggedIn -> content(user)
@Composable fun GuestGuard(sessionState: SessionState, onAuthenticated: () -> Unit, content: @Composable () -> Unit)
// Loading -> FullScreenLoading(); LoggedIn -> LaunchedEffect(Unit){ onAuthenticated() } + FullScreenLoading(); LoggedOut -> content()
```
In `TodoNavHost`, each guarded `composable(route) { entry -> }` wraps callbacks with an **active-entry check** so exiting screens (mid-animation) cannot redirect:
`onUnauthenticated = { if (navController.currentBackStackEntry?.id == entry.id) navController.navigateToLogin() }`,
`onAuthenticated = { if (navController.currentBackStackEntry?.id == entry.id) navController.navigateToDashboard() }`.
Effects: successful login flips session -> GuestGuard sends Login to Dashboard (Home stays beneath, back returns Home). Logout: `navController.navigateHomeClearingBackStack()` then `sessionViewModel.logout()`. Cold start always lands on Home.

`TodoNavHost(navController: NavHostController, sessionState: SessionState, modifier: Modifier = Modifier)` — `NavHost(startDestination = Routes.HOME)`; holds `val scope = rememberCoroutineScope()` and `val snackbar = LocalSnackbarHostState.current` for post-navigation messages. Screen wiring:
- Home: `HomeScreen(isLoggedIn, onGetStarted = { navigate(if loggedIn DASHBOARD else SIGNUP) }, onLogin = { navigate(LOGIN) }, onViewReviews = { navigate(REVIEWS) })`
- Login: `LoginScreen(onNavigateToSignup = { navigate(SIGNUP){ popUpTo(LOGIN){inclusive=true} } })`
- Signup: `SignupScreen(onNavigateToLogin = {...popUpTo(SIGNUP) inclusive}, onSignupSuccess = { same nav; scope.launch{ snackbar.showSnackbar("Account created. Please log in.") } })`
- Dashboard: `DashboardScreen(onViewTasks, onAddTask, onViewReviews, onWriteReview)`
- Tasks: `TasksScreen(onAddTask = { navigate(ADD_TASK) })`
- AddTask: `AddTaskScreen(onTaskSaved = { popBackStack(); scope.launch{ snackbar.showSnackbar("Task added successfully") } })`
- Reviews: `ReviewsScreen(isLoggedIn, onWriteReview = { navigate(if loggedIn WRITE_REVIEW else LOGIN) })`
- WriteReview: `WriteReviewScreen(onReviewSubmitted = { popBackStack(); scope.launch{ snackbar.showSnackbar("Review added successfully") } })`

`TodoTopBar(title: String, canNavigateBack: Boolean, isLoggedIn: Boolean, onNavigateBack: () -> Unit, onNavigate: (String) -> Unit, onLogout: () -> Unit)` — M3 `TopAppBar`; back arrow when `canNavigateBack`; `MoreVert` dropdown (replaces web Navbar): Home, Reviews, and if logged in Dashboard, My Tasks, Write a Review, Log out; else Log in, Sign up.

`TodoApp()` — root composable: `navController = rememberNavController()`, `sessionViewModel: SessionViewModel = hiltViewModel()`, `snackbarHostState = remember { SnackbarHostState() }`, `CompositionLocalProvider(LocalSnackbarHostState provides snackbarHostState)` around `Scaffold(topBar = TodoTopBar(...), snackbarHost = { SnackbarHost(snackbarHostState) })` with `TodoNavHost(..., Modifier.padding(innerPadding))`. Title from `currentBackStackEntryAsState()` route; `canNavigateBack = navController.previousBackStackEntry != null`.

`MainActivity`: `@AndroidEntryPoint`, `enableEdgeToEdge()`, `setContent { TodoTheme { TodoApp() } }`. `TodoApplication`: `@HiltAndroidApp class TodoApplication : Application()`.

## 11. Shared UI (`ui.components`, `ui.theme`) — SCAFFOLD
```kotlin
val LocalSnackbarHostState = staticCompositionLocalOf<SnackbarHostState> { error("No SnackbarHostState provided") }
@Composable fun FormTextField(value: String, onValueChange: (String) -> Unit, label: String, modifier: Modifier = Modifier,
    error: String? = null, singleLine: Boolean = true, minLines: Int = 1, isPassword: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text, imeAction: ImeAction = ImeAction.Next, enabled: Boolean = true)
    // OutlinedTextField, fillMaxWidth, isError = error != null, supportingText shows error; isPassword -> PasswordVisualTransformation + show/hide toggle (Lock icon)
@Composable fun LoadingButton(text: String, onClick: () -> Unit, isLoading: Boolean, modifier: Modifier = Modifier, enabled: Boolean = true)
    // Button disabled while loading, shows 20.dp CircularProgressIndicator instead of text
@Composable fun FullScreenLoading(modifier: Modifier = Modifier)
@Composable fun EmptyState(title: String, message: String, modifier: Modifier = Modifier, action: (@Composable () -> Unit)? = null)
fun formatDate(epochMillis: Long): String       // java.time, "dd MMM yyyy", Locale.getDefault(), ZoneId.systemDefault()
fun formatDateTime(epochMillis: Long): String   // "dd MMM yyyy, HH:mm"
```
Theme: `@Composable fun TodoTheme(darkTheme: Boolean = isSystemInDarkTheme(), dynamicColor: Boolean = true, content: @Composable () -> Unit)`; dynamic color on API 31+, else custom schemes from `Color.kt` (blue primary `#3B82F6` / dark surfaces `#111827`,`#1F2937` echoing the web's gray-900/blue-500); `Typography` in `Type.kt`. Rating star tint: `val StarGold = Color(0xFFFFC107)`, `val StarEmpty = Color(0xFFE4E5E9)` in `Color.kt`.

## 12. Screen-by-screen UX
All screens: scrollable `Column` with 16.dp padding (lists use `LazyColumn`), content max width natural, inline field errors, keyboard IME actions.
- **Home** (WP4): hero ("Manage your time, achieve your goals" + one-line intro), `QuoteCard` with rotating quote (crossfade via `AnimatedContent`, every 5 s), CTA row: "Get started" (+ "Log in" when logged out), "Read reviews" text button, then `FeatureHighlights`: 5 cards (Improved Health, Increased Productivity, Achieve Goals, Better Work-Life Balance, Career Growth) with copy from web `Features.jsx`, `Icons` from core set, optional "Learn more" via `LocalUriHandler` (web's external URLs; donate card dropped).
  `HomeUiState(quote: Quote? = null)`; `HomeViewModel(quoteRepository)`.
- **Login** (WP1): email, password (`isPassword`), "Log in" `LoadingButton`, link "No account? Sign up". `LoginUiState(email="", password="", emailError: String?=null, passwordError: String?=null, formError: String?=null, isSubmitting=false)`; methods `onEmailChange(String)`, `onPasswordChange(String)`, `onSubmit()`. Field change clears that field's error and formError. formError shown as error-colored text above button. Navigation on success is handled by GuestGuard.
- **Signup** (WP1): name, email, password, "Create account", link to login. `SignupUiState(name, email, password, nameError, emailError, passwordError, formError, isSubmitting=false, signupComplete=false)`; methods `onNameChange, onEmailChange, onPasswordChange, onSubmit(), onSignupHandled()`. Screen: `LaunchedEffect(state.signupComplete){ if (it) { onSignupSuccess(); viewModel.onSignupHandled() } }`. `AppResult.Error.field` routes message to the field error, null field -> formError.
- **Dashboard** (WP4): greeting "Good morning|afternoon|evening, {name}" (hour <12 / <17 / else, `java.time.LocalTime.now()`), 3 `StatCard`s (Total, Pending, Completed), quick-nav cards: My Tasks, Create New Task, Reviews, Write a Review; `QuoteCard` ("Thoughts"). `DashboardUiState(userName="", greeting="", stats=TaskStats(), quote: Quote?=null, isLoading=true)`; VM injects `AuthRepository, TaskRepository, QuoteRepository`; `currentUser.flatMapLatest { user -> stats flow }` combined with `rotatingQuotes(ROTATION_INTERVAL_MS)`.
- **Tasks** (WP2): `LazyColumn` of `TaskItem` (title, description, "Added {formatDate}", status `AssistChip`/label colored, checkbox or `Check` icon toggles status, `Delete` icon opens `AlertDialog` confirm). FAB-equivalent "Add task" button at top (screen has no Scaffold of its own; use `Box` + `ExtendedFloatingActionButton` aligned BottomEnd). Empty: `EmptyState("No tasks yet", "Create your first task to get started.", action = Add task button)`. Header line "N tasks · P pending · C completed".
  `TasksUiState(tasks: List<Task> = emptyList(), isLoading: Boolean = true, pendingDeleteTask: Task? = null, userMessage: String? = null)`; methods `onToggleStatus(task: Task)`, `onDeleteRequest(task: Task)`, `onDeleteConfirm()`, `onDeleteDismiss()`, `onUserMessageShown()`. Internal: `MutableStateFlow` for dialog/message combined with tasks flow. Delete success message "Task deleted".
  `@Composable fun TaskItem(task: Task, onToggleStatus: () -> Unit, onDelete: () -> Unit, modifier: Modifier = Modifier)`.
- **AddTask** (WP2): title, description (multiline, minLines 4), status selector (two `FilterChip`s Pending/Completed, default Pending — web had status dropdown), "Add task" `LoadingButton`, "Clear" text button. `AddTaskUiState(title="", description="", status=TaskStatus.PENDING, titleError, descriptionError, isSaving=false, saved=false, userMessage=null)`; methods `onTitleChange, onDescriptionChange, onStatusChange(TaskStatus), onClear(), onSave(), onSavedHandled(), onUserMessageShown()`. No user -> userMessage NOT_LOGGED_IN.
- **Reviews** (WP3): header with average rating (1 decimal, star row) + count; `LazyColumn` of `ReviewCard` (author name, star row, description, formatDate). Button "Write a review" (logged out -> goes to login). Empty state "No reviews yet". `ReviewsUiState(reviews: List<Review> = emptyList(), averageRating: Double = 0.0, isLoading = true)`; `ReviewsViewModel(reviewRepository)`.
  `@Composable fun ReviewCard(review: Review, modifier: Modifier = Modifier)`; `@Composable fun StarRating(rating: Int, modifier: Modifier = Modifier, onRatingChange: ((Int) -> Unit)? = null, starSize: Dp = 24.dp)` (`Icons.Filled.Star` tinted StarGold/StarEmpty, clickable only when callback non-null, contentDescription "N stars").
- **WriteReview** (WP3): `StarRating(starSize = 40.dp, onRatingChange)`, rating error text, description (multiline), "Submit review" `LoadingButton`. `WriteReviewUiState(rating=0, description="", ratingError, descriptionError, isSubmitting=false, submitted=false, userMessage=null)`; methods `onRatingChange(Int), onDescriptionChange(String), onSubmit(), onSubmittedHandled(), onUserMessageShown()`.

## 13. Build configuration
`gradle/libs.versions.toml` (pin exactly):
```toml
[versions]
agp = "8.7.3"
kotlin = "2.0.21"
ksp = "2.0.21-1.0.27"
coreKtx = "1.15.0"
lifecycle = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.10.01"
navigationCompose = "2.8.4"
room = "2.6.1"
datastore = "1.1.1"
hilt = "2.52"
hiltNavigationCompose = "1.2.0"
junit = "4.13.2"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycle" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycle" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-core = { group = "androidx.compose.material", name = "material-icons-core" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
androidx-datastore-preferences = { group = "androidx.datastore", name = "datastore-preferences", version.ref = "datastore" }
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }
androidx-hilt-navigation-compose = { group = "androidx.hilt", name = "hilt-navigation-compose", version.ref = "hiltNavigationCompose" }
junit = { group = "junit", name = "junit", version.ref = "junit" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
```
- Root `build.gradle.kts`: all 5 plugins `alias(...) apply false`. `settings.gradle.kts`: `pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }`, `dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }`, `rootProject.name = "TodoList"`, `include(":app")`. No foojay toolchain resolver (JDK 17 must be installed locally).
- `app/build.gradle.kts`: plugins android-application, kotlin-android, kotlin-compose, ksp, hilt. `android { namespace = "com.utsavmehta.todolist"; compileSdk = 35; defaultConfig { applicationId = "com.utsavmehta.todolist"; minSdk = 26; targetSdk = 35; versionCode = 1; versionName = "1.0.0"; testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner" }; buildTypes { release { isMinifyEnabled = false; proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro") } }; compileOptions { source/targetCompatibility = JavaVersion.VERSION_17 }; buildFeatures { compose = true }; packaging { resources { excludes += "/META-INF/{AL2.0,LGPL2.1}" } } }`, `kotlin { jvmToolchain(17) }`, `ksp { arg("room.generateKotlin", "true") }`.
  dependencies: `implementation(platform(libs.androidx.compose.bom))` + core-ktx, lifecycle-runtime-ktx, lifecycle-runtime-compose, lifecycle-viewmodel-compose, activity-compose, compose-ui, ui-graphics, ui-tooling-preview, material3, material-icons-core, navigation-compose, room-runtime, room-ktx, datastore-preferences, hilt-android, hilt-navigation-compose; `ksp(libs.androidx.room.compiler)`, `ksp(libs.hilt.compiler)`; `debugImplementation(libs.androidx.compose.ui.tooling)`; `testImplementation(libs.junit)`.
- `gradle.properties`: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8`, `android.useAndroidX=true`, `android.nonTransitiveRClass=true`, `kotlin.code.style=official`.
- Wrapper: `distributionUrl=https\://services.gradle.org/distributions/gradle-8.9-bin.zip`.
- Manifest: no permissions; `<application android:name=".TodoApplication" android:label="@string/app_name" android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" android:theme="@style/Theme.TodoList" android:allowBackup="false" android:supportsRtl="true">`, `MainActivity` `exported="true"`, `windowSoftInputMode="adjustResize"`, MAIN/LAUNCHER filter. `Theme.TodoList` parent = `android:Theme.Material.Light.NoActionBar` (platform; no MDC dependency). Adaptive icon only (`mipmap-anydpi-v26`, valid since minSdk 26).

## 14. Testing (JVM unit tests only, `app/src/test`)
`ValidatorsTest` (SCAFFOLD): every rule boundary (blank, max+1, rating 0/1/5/6, email cases). `PasswordHasherTest` (WP1): hash != plaintext, verify true for same password, false for wrong password and malformed string, two hashes of same password differ (salt). Both pure JVM — no Robolectric.

## 15. Integration order
Scaffold lands first (everything referenced by DI/nav/DB). WPs are independent afterwards; each WP touches only its own files (MANIFEST.md). `TodoDatabase` and `RepositoryModule` reference WP-owned DAOs/Impls by the exact names above, so the project compiles only when all four WPs are merged — reviewers must diff signatures against this spec.
