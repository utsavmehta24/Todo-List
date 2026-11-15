# TodoList — Android

A native Android port of the [Todo-List web app](https://github.com/utsavmehta24/Todo-List), rebuilt as a modern, local-first Kotlin app. Feature parity with the web version: accounts (signup/login/logout), per-user tasks with pending/completed status, public reviews with 1–5 star ratings, a stats dashboard, and a landing screen with rotating motivational quotes.

## Tech stack

- **Kotlin 2.0.21** / **Jetpack Compose** (Material 3, Compose BOM 2024.10.01)
- **MVVM + Repository** pattern with unidirectional data flow (StateFlow)
- **Room 2.6.1** for persistence (users, tasks, reviews) via KSP
- **DataStore Preferences** for session persistence
- **Hilt 2.52** for dependency injection
- **Navigation Compose** with auth-guarded routes
- AGP 8.7.3 · Gradle 8.9 · JDK 17 toolchain · minSdk 26 · target/compileSdk 35

Passwords are stored as salted PBKDF2-HMAC-SHA256 hashes with constant-time verification; there is no backend — all data lives on-device.

## Building

Requirements: JDK 17 and the Android SDK (platform 35). With Android Studio (Ladybug or newer), just open this `android/` directory. From the command line:

```bash
# point local.properties at your SDK, then:
./gradlew :app:assembleDebug        # APK at app/build/outputs/apk/debug/app-debug.apk
./gradlew :app:testDebugUnitTest    # unit tests
```

## Project structure

```
app/src/main/java/com/utsavmehta/todolist/
├── data/
│   ├── local/        # Room entities, DAOs, database, PBKDF2 hasher, DataStore session
│   └── repository/   # Repository interfaces + implementations
├── domain/           # Domain models, validation rules
├── di/               # Hilt modules
└── ui/
    ├── auth/         # Login, signup
    ├── tasks/        # Task list, add task
    ├── reviews/      # Review list, write review, star rating
    ├── dashboard/    # Greeting, stats, quick actions
    ├── home/         # Landing, quotes, feature highlights
    ├── navigation/   # NavHost, routes, auth guards, session
    ├── components/   # Shared composables
    └── theme/        # Material 3 theme (dynamic color on Android 12+)
```

Architecture docs: [`docs/SPEC.md`](docs/SPEC.md) and [`docs/MANIFEST.md`](docs/MANIFEST.md).

## Splitting into its own repository

This project is self-contained. To make it a standalone repo with history:

```bash
# from the Todo-List repo root, on the branch containing android/
git subtree split --prefix=android -b android-standalone

# create an empty repo on GitHub (e.g. Todo-List-Android), then:
git push https://github.com/utsavmehta24/Todo-List-Android.git android-standalone:main
```

Or simply copy this `android/` directory into a fresh `git init` if history doesn't matter.
