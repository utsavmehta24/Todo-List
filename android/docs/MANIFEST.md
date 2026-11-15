# Todo-List Android — File Manifest (v1)

Paths are relative to `android/`. `K/` = `app/src/main/java/com/utsavmehta/todolist/`, `T/` = `app/src/test/java/com/utsavmehta/todolist/`.
Every file listed here exists in the finished project; nothing else does. Signatures are defined in SPEC.md (section numbers in brackets).
Owner tags: **SCAFFOLD** = built by the mid-level manager before juniors start; **WP1-WP4** = junior work packages.

## SCAFFOLD — build system & project root
- `settings.gradle.kts` — SCAFFOLD — Plugin/dependency repositories (google, mavenCentral), FAIL_ON_PROJECT_REPOS, includes `:app` [13].
- `build.gradle.kts` — SCAFFOLD — Root build declaring the 5 catalog plugins with `apply false` [13].
- `gradle.properties` — SCAFFOLD — JVM args, AndroidX, non-transitive R, Kotlin code style [13].
- `gradle/libs.versions.toml` — SCAFFOLD — Version catalog pinned exactly as SPEC [13].
- `gradle/wrapper/gradle-wrapper.properties` — SCAFFOLD — Pins Gradle 8.9 bin distribution.
- `gradle/wrapper/gradle-wrapper.jar` — SCAFFOLD — Wrapper bootstrap binary (copy from a Gradle 8.9 install or `gradle wrapper --gradle-version 8.9`; never hand-written).
- `gradlew` — SCAFFOLD — POSIX wrapper launcher script (executable bit set), generated with the jar.
- `gradlew.bat` — SCAFFOLD — Windows wrapper launcher script, generated with the jar.
- `.gitignore` — SCAFFOLD — Ignores `.gradle/`, `build/`, `local.properties`, `.idea/`, `*.iml`, `.kotlin/`, `captures/`.
- `app/build.gradle.kts` — SCAFFOLD — App module: android/kotlin/compose/ksp/hilt plugins, SDK 35/26, Java 17 toolchain, dependencies [13].
- `app/proguard-rules.pro` — SCAFFOLD — Placeholder (minify disabled); comment-only file.

## SCAFFOLD — Android resources & manifest
- `app/src/main/AndroidManifest.xml` — SCAFFOLD — Declares `TodoApplication`, launcher `MainActivity`, theme, icons; no permissions [13].
- `app/src/main/res/values/strings.xml` — SCAFFOLD — Only `app_name` = "TodoList".
- `app/src/main/res/values/themes.xml` — SCAFFOLD — `Theme.TodoList` extending `android:Theme.Material.Light.NoActionBar` (pre-Compose window theme).
- `app/src/main/res/values/colors.xml` — SCAFFOLD — `ic_launcher_background` color (#1F2937).
- `app/src/main/res/drawable/ic_launcher_foreground.xml` — SCAFFOLD — 108dp vector checkmark-in-list foreground for the adaptive icon.
- `app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` — SCAFFOLD — Adaptive launcher icon (background color + foreground vector).
- `app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` — SCAFFOLD — Round adaptive launcher icon, same layers.

## SCAFFOLD — app entry, domain, data core, DI
- `K/TodoApplication.kt` — SCAFFOLD — `@HiltAndroidApp` Application class.
- `K/MainActivity.kt` — SCAFFOLD — `@AndroidEntryPoint` activity; edge-to-edge; `TodoTheme { TodoApp() }` [10].
- `K/domain/model/User.kt` — SCAFFOLD — `User(id, name, email)` domain model [3].
- `K/domain/model/Task.kt` — SCAFFOLD — `Task` domain model [3].
- `K/domain/model/TaskStatus.kt` — SCAFFOLD — `TaskStatus` enum with storageValue/label/toggled/fromStorage [3].
- `K/domain/model/TaskStats.kt` — SCAFFOLD — `TaskStats(total, pending, completed)` [3].
- `K/domain/model/Review.kt` — SCAFFOLD — `Review` domain model including `authorName` [3].
- `K/domain/model/Quote.kt` — SCAFFOLD — `Quote(text, author)` [3].
- `K/domain/model/AppResult.kt` — SCAFFOLD — `AppResult` sealed result + `FormField` enum [3].
- `K/domain/model/SessionState.kt` — SCAFFOLD — `SessionState` Loading/LoggedOut/LoggedIn(user) [3].
- `K/domain/validation/Validators.kt` — SCAFFOLD — `Limits`, `ValidationMessages`, `Validators` (all form rules + email normalization) [4].
- `K/data/local/entity/UserEntity.kt` — SCAFFOLD — `users` table, unique email index [5].
- `K/data/local/entity/TaskEntity.kt` — SCAFFOLD — `tasks` table, FK user_id CASCADE, indices [5].
- `K/data/local/entity/ReviewEntity.kt` — SCAFFOLD — `reviews` table, FK user_id CASCADE, indices [5].
- `K/data/local/entity/TaskStatsRow.kt` — SCAFFOLD — Projection for the task-stats aggregate query [5].
- `K/data/local/entity/ReviewWithAuthorRow.kt` — SCAFFOLD — Projection for reviews JOIN users (author_name) [5].
- `K/data/local/entity/EntityMappers.kt` — SCAFFOLD — `toDomain()` extensions for UserEntity, TaskEntity, TaskStatsRow, ReviewWithAuthorRow [5].
- `K/data/local/TodoDatabase.kt` — SCAFFOLD — `@Database` v1 with 3 entities and 3 DAO accessors [5].
- `K/data/local/session/SessionManager.kt` — SCAFFOLD — DataStore-backed current-user-id session (start/clear/observe) [7].
- `K/data/repository/AuthRepository.kt` — SCAFFOLD — Auth repository interface [8].
- `K/data/repository/TaskRepository.kt` — SCAFFOLD — Task repository interface [8].
- `K/data/repository/ReviewRepository.kt` — SCAFFOLD — Review repository interface [8].
- `K/data/repository/QuoteRepository.kt` — SCAFFOLD — Quote repository interface + `ROTATION_INTERVAL_MS` [8].
- `K/di/DatabaseModule.kt` — SCAFFOLD — Provides singleton `TodoDatabase` and the three DAOs [9].
- `K/di/DataStoreModule.kt` — SCAFFOLD — Provides singleton `DataStore<Preferences>` file "session" [9].
- `K/di/RepositoryModule.kt` — SCAFFOLD — `@Binds` the four `*RepositoryImpl` classes to their interfaces [9].

## SCAFFOLD — UI shell (theme, components, navigation)
- `K/ui/theme/Color.kt` — SCAFFOLD — Light/dark palette constants plus `StarGold`/`StarEmpty` [11].
- `K/ui/theme/Type.kt` — SCAFFOLD — Material 3 `Typography` instance.
- `K/ui/theme/Theme.kt` — SCAFFOLD — `TodoTheme` with dynamic color (API 31+) and fallback schemes [11].
- `K/ui/components/FormTextField.kt` — SCAFFOLD — Outlined text field with error text and password toggle [11].
- `K/ui/components/LoadingButton.kt` — SCAFFOLD — Button showing a spinner while an action is in flight [11].
- `K/ui/components/LoadingIndicator.kt` — SCAFFOLD — `FullScreenLoading` centered progress indicator [11].
- `K/ui/components/EmptyState.kt` — SCAFFOLD — Title/message/optional-action placeholder for empty lists [11].
- `K/ui/components/SnackbarHost.kt` — SCAFFOLD — `LocalSnackbarHostState` CompositionLocal [11].
- `K/ui/components/DateFormat.kt` — SCAFFOLD — `formatDate` / `formatDateTime` for epoch millis [11].
- `K/ui/navigation/Routes.kt` — SCAFFOLD — Route constants and `titleFor(route)` [10].
- `K/ui/navigation/NavigationActions.kt` — SCAFFOLD — `NavHostController` helpers (login, dashboard, home-clear, single-top) [10].
- `K/ui/navigation/AuthGuards.kt` — SCAFFOLD — `AuthGuard` and `GuestGuard` composables [10].
- `K/ui/navigation/SessionViewModel.kt` — SCAFFOLD — App-wide `SessionState` StateFlow and logout [10].
- `K/ui/navigation/TodoTopBar.kt` — SCAFFOLD — Top app bar with back arrow and session-aware overflow menu [10].
- `K/ui/navigation/TodoNavHost.kt` — SCAFFOLD — NavHost wiring all 8 routes, guards, and post-nav snackbars [10].
- `K/ui/navigation/TodoApp.kt` — SCAFFOLD — Root Scaffold: top bar, snackbar host, NavHost, session collection [10].
- `T/domain/validation/ValidatorsTest.kt` — SCAFFOLD — JUnit4 boundary tests for every validator [14].

## WP1 — Auth feature (signup, login, logout backend, password hashing)
- `K/data/local/dao/UserDao.kt` — WP1 — Insert / findByEmail / emailExists / observeById queries [6].
- `K/data/local/security/PasswordHasher.kt` — WP1 — Salted PBKDF2-HMAC-SHA256 hash + constant-time verify [7].
- `K/data/repository/AuthRepositoryImpl.kt` — WP1 — Signup/login/logout/currentUser over UserDao, SessionManager, PasswordHasher [8].
- `K/ui/auth/LoginViewModel.kt` — WP1 — `LoginUiState` + login form state, validation and submit [12].
- `K/ui/auth/LoginScreen.kt` — WP1 — Email/password form with inline errors and link to signup [12].
- `K/ui/auth/SignupViewModel.kt` — WP1 — `SignupUiState` + signup form state, field-routed errors, completion event [12].
- `K/ui/auth/SignupScreen.kt` — WP1 — Name/email/password form; fires `onSignupSuccess` once [12].
- `T/data/local/security/PasswordHasherTest.kt` — WP1 — JUnit4 tests for hash/verify/salt/malformed input [14].

## WP2 — Tasks feature (list, add, toggle status, delete)
- `K/data/local/dao/TaskDao.kt` — WP2 — Per-user observe, stats aggregate, insert, updateStatus, delete [6].
- `K/data/repository/TaskRepositoryImpl.kt` — WP2 — Validated, user-scoped task CRUD and stats mapping [8].
- `K/ui/tasks/TasksViewModel.kt` — WP2 — `TasksUiState`; observes current user's tasks; toggle and confirm-delete flow [12].
- `K/ui/tasks/TasksScreen.kt` — WP2 — Task list with summary header, empty state, delete dialog, add FAB [12].
- `K/ui/tasks/TaskItem.kt` — WP2 — Card for one task: title, description, date, status toggle, delete [12].
- `K/ui/tasks/AddTaskViewModel.kt` — WP2 — `AddTaskUiState`; title/description/status form, validation, save event [12].
- `K/ui/tasks/AddTaskScreen.kt` — WP2 — Add-task form with status chips, save and clear actions [12].

## WP3 — Reviews feature (list all, write)
- `K/data/local/dao/ReviewDao.kt` — WP3 — Insert and observe-all-with-author JOIN query [6].
- `K/data/repository/ReviewRepositoryImpl.kt` — WP3 — Validated review insert and mapped review stream [8].
- `K/ui/reviews/ReviewsViewModel.kt` — WP3 — `ReviewsUiState`; all reviews plus average rating [12].
- `K/ui/reviews/ReviewsScreen.kt` — WP3 — Average-rating header, review list, empty state, write-review button [12].
- `K/ui/reviews/ReviewCard.kt` — WP3 — Card showing author, stars, description, date [12].
- `K/ui/reviews/StarRating.kt` — WP3 — Read-only or interactive 1-5 star row [12].
- `K/ui/reviews/WriteReviewViewModel.kt` — WP3 — `WriteReviewUiState`; rating/description form, validation, submit event [12].
- `K/ui/reviews/WriteReviewScreen.kt` — WP3 — Interactive stars + description form with submit [12].

## WP4 — Home, dashboard, quotes
- `app/src/main/assets/quotes.json` — WP4 — JSON array of >=20 `{text, author}` quotes (seeded from web `public/quotes.json`).
- `K/data/repository/QuoteRepositoryImpl.kt` — WP4 — Asset-backed cached quote loading and rotating quote Flow [8].
- `K/ui/home/HomeViewModel.kt` — WP4 — `HomeUiState`; exposes the rotating quote [12].
- `K/ui/home/HomeScreen.kt` — WP4 — Landing hero, quote card, CTAs, feature highlights [12].
- `K/ui/home/QuoteCard.kt` — WP4 — `QuoteCard(quote: Quote?, modifier, title: String = "Thoughts")` with crossfade (also used by Dashboard).
- `K/ui/home/FeatureHighlights.kt` — WP4 — Static list of 5 time-management benefit cards with optional Learn-more links [12].
- `K/ui/dashboard/DashboardViewModel.kt` — WP4 — `DashboardUiState`; greeting, live task stats, rotating quote [12].
- `K/ui/dashboard/DashboardScreen.kt` — WP4 — Greeting, stat cards, quick-nav cards, quote card [12].
- `K/ui/dashboard/StatCard.kt` — WP4 — `StatCard(label: String, value: Int, modifier)` single-metric card.

## Cross-WP dependency notes
- WP4 Dashboard consumes `TaskRepository.observeTaskStats` (interface is SCAFFOLD, so WP4 does not wait on WP2).
- `QuoteCard` lives in `ui/home` but is imported by `ui/dashboard` (same WP, no cross-team risk).
- `TodoDatabase` and `RepositoryModule` (SCAFFOLD) reference `UserDao`, `TaskDao`, `ReviewDao`, `AuthRepositoryImpl`, `TaskRepositoryImpl`, `ReviewRepositoryImpl`, `QuoteRepositoryImpl` by exact name; the build is green only after all four WPs merge.
- Totals: 61 SCAFFOLD files, 8 WP1, 7 WP2, 8 WP3, 9 WP4 = 93 files.
