# Pocket Shopping List

Mobile-first shopping list application built with Angular and prepared for Android packaging via Capacitor.

## Features

- Create and manage shopping lists
- Product management (add, edit, delete, mark purchased)
- Quantity with units (`szt`, `g`, `kg`, `ml`, `l`)
- List sharing flow (owner + shared users)
- Bottom-sheet options menu (mobile UX)
- Sorting from menu (`category`, `name`, `priority`, `status`)
- Search inside list
- Archive and restore lists
- Save list as template and create list from template
- Basic statistics view
- Light/Dark theme switch
- PL/EN language switch
- Demo mode with limits and periodic reset

## Tech Stack

- Angular 19
- TypeScript
- CSS (mobile-first)
- LocalStorage (data persistence)
- Capacitor 8 (Android shell)

## Requirements

- Node.js `>=18`
- npm `>=9`
- (Optional for Android) Android Studio with Android SDK

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run start
```

Open:

- `http://localhost:4200/`

## Available Scripts

- `npm run start` - start Angular dev server
- `npm run build` - build Angular app
- `npm run build:production` - production build
- `npm run test` - run unit tests
- `npm run cap:copy` - copy web assets to Android project
- `npm run cap:sync` - sync Android Capacitor project
- `npm run build:android` - production build + copy/sync for Android

## Project Structure

```text
src/
  app/
    shopping-lists/          # lists overview
    shopping-list-detail/    # list details, products, bottom sheets
    services/                # auth, lists, theme, i18n, demo limits, etc.
android/                     # Capacitor Android project
graphics/                    # source graphics/icons
```

## Android Build (Local APK)

1. Build and sync web app into Android project:

```bash
npm run build:android
```

2. Open `android/` in Android Studio.
3. Build APK:
   - `Build > Build Bundle(s) / APK(s) > Build APK(s)`
4. Locate output APK (typically):
   - `android/app/build/outputs/apk/debug/app-debug.apk`
5. Install on phone directly, or upload APK to Google Drive and install from phone.

> Note: `capacitor.config.ts` uses `webDir: dist/todo-angular-cursor/browser` (required for Angular 19 app build output).

## Data and Demo Mode

- Data is currently stored in browser/device `localStorage`.
- Demo user flow is available for quick testing.
- Demo constraints are applied (e.g. list/product limits), with reset support.

## Notes for Contributors

- Keep UI mobile-first.
- Prefer consistent theme variables from `src/styles.css`.
- Do not commit generated build artifacts (`dist/`, Android build caches, generated assets already covered by `.gitignore`).

## License

MIT
