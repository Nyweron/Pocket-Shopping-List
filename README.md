# Pocket Shopping List

Ten dokument jest dostępny w dwóch wersjach językowych z tą samą treścią: **[Polski](#polski)** · **[English](#english)**

This document is available in two languages with the same content: **[Polski](#polski)** · **[English](#english)**

---

## Polski

### Opis

Mobilna aplikacja list zakupów (mobile-first), zbudowana w Angularze i przygotowana do pakowania na Androida przez Capacitor.

### Funkcje

- Tworzenie i zarządzanie listami zakupów
- Produkty (dodawanie, edycja, usuwanie, oznaczanie jako kupione)
- Ilość z jednostkami (`szt`, `g`, `kg`, `ml`, `l`)
- Udostępnianie list (właściciel + współużytkownicy)
- Menu opcji w formie bottom sheet (UX mobilny)
- Sortowanie z menu (`kategoria`, `nazwa`, `priorytet`, `status`)
- Wyszukiwanie w obrębie listy
- Archiwum i przywracanie list
- Szablony: zapis listy jako szablon i utworzenie listy z szablonu
- Widok statystyk
- Przełącznik motywu jasny / ciemny
- Przełącznik języka PL / EN
- Tryb demo z limitami i okresowym resetem

### Stack technologiczny

- Angular 19
- TypeScript
- CSS (mobile-first)
- LocalStorage (trwałość danych)
- Capacitor 8 (obudowa Android)

### Wymagania

- Node.js `>=18`
- npm `>=9`
- (Opcjonalnie na Androida) Android Studio z Android SDK

### Start

Instalacja zależności:

```bash
npm install
```

Serwer deweloperski:

```bash
npm run start
```

W przeglądarce: `http://localhost:4200/`

### Skrypty npm

- `npm run start` — serwer deweloperski Angular
- `npm run build` — build aplikacji
- `npm run build:production` — build produkcyjny
- `npm run test` — testy jednostkowe (tryb watch)
- `npm run test:unit` — testy jednostkowe jednorazowo (tryb bramki lokalnej / CI)
- `npm run test:watch` — testy jednostkowe w trybie watch
- `npm run test:coverage` — testy z raportem pokrycia (patrz **Bramka pokrycia** poniżej)
- `npm run test:e2e` — smoke testy e2e (Playwright)
- `npm run lint` — ESLint dla plików TypeScript
- `npm run verify` — lokalna bramka: `lint + testy jednostkowe + build produkcyjny`
- `npm run verify:full` — rozszerzona bramka: `lint + testy jednostkowe + e2e + build produkcyjny`
- `npm run cap:copy` — kopiowanie zasobów web do projektu Android
- `npm run cap:sync` — synchronizacja projektu Capacitor (Android)
- `npm run build:android` — build produkcyjny + copy/sync pod Androida
- `npm run icons` — odtwarza `favicon.ico` oraz PNG (16×16, 32×32) z `graphics/icon_background_foreground.svg` (uruchom po zmianie ikony)

### Favicon (SVG + fallbacki)

W `index.html` jest favicon SVG oraz fallbacki PNG i `.ico` w `public/` dla starszych przeglądarek. Po edycji pliku SVG uruchom `npm run icons`, żeby zaktualizować pliki rastrowe.

### Praca z testami (rozwój lokalny)

**Zalecenia:**

- **Nowy feature** — testy jednostkowe logiki (serwisy, czyste funkcje); przy nietrywialnym UI rozważ test komponentu.
- **Poprawka błędu** — najpierw test odtwarzający błąd (regresja), potem zmiana w kodzie.

**Na co dzień / przed większą zmianą:**

1. Szybka bramka (bez coverage):

```bash
npm run verify
```

2. Pełny smoke (z e2e):

```bash
npm run verify:full
```

3. Raport pokrycia z **łagodnym progiem** (fail, jeśli pokrycie spadnie wyraźnie poniżej minimum):

```bash
npm run test:coverage
```

#### Bramka pokrycia (coverage gate)

Minimalne progi globalne są w `karma.conf.js` (`coverageReporter.check.global`). Obecnie (łagodnie, poniżej typowego stanu projektu):

| Metryka    | Minimum |
| ---------- | ------- |
| Statements | 35%     |
| Branches   | 20%     |
| Functions  | 38%     |
| Lines      | 38%     |

`npm run test:unit` **nie** uruchamia bramki pokrycia — tylko `npm run test:coverage` z `--code-coverage`. Progi podnoś stopniowo wraz z rozwojem testów.

**E2E (pierwszy raz na maszynie):** jeśli Playwright zgłosi brak przeglądarki: `npx playwright install chromium`.

### Struktura projektu

```text
src/
  app/
    shopping-lists/          # przegląd list
    shopping-list-detail/    # szczegóły listy, produkty, bottom sheets
    services/                # auth, listy, motyw, i18n, limity demo itd.
android/                     # projekt Capacitor (Android)
graphics/                    # grafiki źródłowe / ikony
```

### Build APK (lokalnie)

1. Build i sync zasobów w projekt Android:

```bash
npm run build:android
```

2. Otwórz folder `android/` w Android Studio.
3. Zbuduj APK: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
4. Typowa ścieżka APK: `android/app/build/outputs/apk/debug/app-debug.apk`
5. Instalacja na telefonie bezpośrednio lub np. przez Google Drive.

> Uwaga: `capacitor.config.ts` ustawia `webDir: dist/todo-angular-cursor/browser` (wymagane dla wyjścia buildu Angular 19).

### Dane i tryb demo

- Dane są w `localStorage` przeglądarki / urządzenia.
- Dostępne jest konto demo do szybkich testów.
- Obowiązują limity demo (np. listy/produkty), z możliwością resetu.

### Wskazówki dla współtwórców

- UI trzymaj w podejściu mobile-first.
- Korzystaj ze zmiennych motywu z `src/styles.css`.
- Nie commituj artefaktów buildu (`dist/`, cache Androida itd. — patrz `.gitignore`).

### Licencja

MIT

---

## English

### Description

Mobile-first shopping list application built with Angular and prepared for Android packaging via Capacitor.

### Features

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

### Tech stack

- Angular 19
- TypeScript
- CSS (mobile-first)
- LocalStorage (data persistence)
- Capacitor 8 (Android shell)

### Requirements

- Node.js `>=18`
- npm `>=9`
- (Optional for Android) Android Studio with Android SDK

### Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run start
```

Open: `http://localhost:4200/`

### npm scripts

- `npm run start` — start Angular dev server
- `npm run build` — build Angular app
- `npm run build:production` — production build
- `npm run test` — unit tests (watch mode)
- `npm run test:unit` — run unit tests once (local/CI gate mode)
- `npm run test:watch` — unit tests in watch mode
- `npm run test:coverage` — unit tests with coverage report (see **Coverage gate** below)
- `npm run test:e2e` — Playwright smoke e2e tests
- `npm run lint` — ESLint for TypeScript sources
- `npm run verify` — local quality gate: `lint + unit tests + production build`
- `npm run verify:full` — extended gate: `lint + unit tests + e2e + production build`
- `npm run cap:copy` — copy web assets to Android project
- `npm run cap:sync` — sync Capacitor Android project
- `npm run build:android` — production build + copy/sync for Android
- `npm run icons` — regenerates `favicon.ico` and PNGs (16×16, 32×32) from `graphics/icon_background_foreground.svg` (run after changing the logo)

### Favicon (SVG + fallbacks)

`index.html` references an SVG favicon plus PNG and `.ico` fallbacks in `public/` for older browsers. After editing the SVG source, run `npm run icons` to refresh the raster files.

### Testing workflow (local development)

**Conventions (recommended):**

- **New feature** — add unit tests for logic (services, pure functions); for non-trivial UI, consider a component test.
- **Bugfix** — first a test that reproduces the bug (regression), then the code fix.

**Daily / before larger changes:**

1. Fast gate (no coverage):

```bash
npm run verify
```

2. Full smoke (including e2e):

```bash
npm run verify:full
```

3. Coverage report with a **soft threshold** (fails if coverage drops clearly below the minimum):

```bash
npm run test:coverage
```

#### Coverage gate

Global minimum thresholds are set in `karma.conf.js` (`coverageReporter.check.global`). Currently (soft, below typical project levels):

| Metric     | Minimum |
| ---------- | ------- |
| Statements | 35%     |
| Branches   | 20%     |
| Functions  | 38%     |
| Lines      | 38%     |

`npm run test:unit` does **not** run the coverage gate — only `npm run test:coverage` with `--code-coverage`. Raise thresholds gradually as tests grow.

**E2E (first time on a machine):** if Playwright reports a missing browser, run: `npx playwright install chromium`.

### Project structure

```text
src/
  app/
    shopping-lists/          # lists overview
    shopping-list-detail/    # list details, products, bottom sheets
    services/                # auth, lists, theme, i18n, demo limits, etc.
android/                     # Capacitor Android project
graphics/                    # source graphics/icons
```

### Android build (local APK)

1. Build and sync the web app into the Android project:

```bash
npm run build:android
```

2. Open `android/` in Android Studio.
3. Build APK: `Build > Build Bundle(s) / APK(s) > Build APK(s)`
4. Typical APK path: `android/app/build/outputs/apk/debug/app-debug.apk`
5. Install on the phone directly, or e.g. via Google Drive.

> Note: `capacitor.config.ts` uses `webDir: dist/todo-angular-cursor/browser` (required for Angular 19 app build output).

### Data and demo mode

- Data is stored in browser/device `localStorage`.
- Demo user flow is available for quick testing.
- Demo constraints apply (e.g. list/product limits), with reset support.

### Notes for contributors

- Keep UI mobile-first.
- Prefer consistent theme variables from `src/styles.css`.
- Do not commit generated build artifacts (`dist/`, Android build caches, etc. — see `.gitignore`).

### License

MIT
