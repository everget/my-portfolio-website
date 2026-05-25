# Project conventions for AI agents

## Stack

- React 19 + TypeScript + Vite (Rolldown)
- Tailwind CSS v4 (CSS-first - no `tailwind.config.js`)
- oxlint + oxfmt for linting and formatting
- Vitest for unit tests, Playwright for E2E
- React Compiler (via `@rolldown/plugin-babel`)
- lefthook for git hooks

## File and folder naming

- Use **lowercased-kebab-case** for all file and folder names.
    - Good: `task-item.tsx`, `use-theme.ts`, `ui/`, `hooks/`
    - Bad: `TaskItem.tsx`, `useTheme.ts`, `UI/`, `Hooks/`

## Comments

- Prefer `//` line comments over `/* */` block comments.
- Keep comments short and direct.
    - Good: `// Preload from localStorage`
    - Bad: `// ── Preload from localStorage ──────────────────────────────────────────────────`
- Avoid decorative separators (`//──`, `// ===`, `// ---`).
- Do not use em dashes (-). Use a hyphen (-) or reword instead.

## Component props

- Name props interfaces `<ComponentName>Props`.
    - Good: `interface ButtonProps { ... }`
    - Bad: `interface Props { ... }`, `interface IButtonProps { ... }`

## Modules

- Prefer ES modules (`import`/`export`) over CommonJS (`require`/`module.exports`).
- Prefer named exports over default exports.
    - Good: `export function App() { … }`
    - Bad: `export default function App() { … }`

## TypeScript

- Prefer `import type` for type-only imports.
- Avoid `any` - use `unknown` + narrowing, or `as unknown as T` when casting across incompatible types.
- Use `as const` for static option arrays.

## App architecture

- Provider setup lives in `src/app.tsx`, not `main.tsx`.
- The component hierarchy is three layers:
    - `AppWithProviders` - holds `PreferencesProvider` and `I18nProvider`
    - `AppWithI18n` - reads preferences and instantiates `I18nProvider`
    - `App` - pure render component, calls `useT()` and renders UI
- When adding a new provider, wrap it in `AppWithProviders`.
- `main.tsx` only renders `<StrictMode><AppWithProviders /></StrictMode>`.

## i18n

- `TranslationKey` is typed from `en.json` only - it is the single source of truth for all keys.
- All other locale files must contain the same keys but may add locale-specific plural forms.
- Plural forms use `Intl.PluralRules` with LDML categories: `zero`, `one`, `two`, `few`, `many`, `other`.
    - `other` is required. The rest are optional and language-dependent.
    - Languages without grammatical pluralization (e.g. Chinese, Japanese, Turkish) use a plain string instead of a plural object.
- Locale code vs flag file stem diverge for some locales:
    - `pt-br` -> `br`, `uk` -> `ua`, `hy` -> `am`, `zh` -> `cn`, `ja` -> `jp`, `ar` -> `sa`, `he` -> `il`
- When adding a new locale, update: `VALID_LOCALES`, `LOCALES`, the lazy loader in `i18n-context.tsx`, and add a JSON file under `src/modules/shared/i18n/locales/`.

## Styling

- All color tokens are defined once in `:root` using `light-dark()` in `src/global.css`.
- Dark mode is driven by toggling `color-scheme` on `:root` - never duplicate color values in a `.dark {}` block.
- Always use semantic Tailwind utilities, not raw colors:
    - Good: `bg-surface`, `text-foreground`, `bg-primary`, `text-muted-foreground`
    - Bad: `bg-white`, `text-gray-900`, `bg-blue-600`
- Header controls (buttons on the primary-color header) use `bg-white/30 hover:bg-white/40 border border-white/40`.
- Locale selector dropdown uses `role="menu"` with `role="menuitem"` on each button (not `listbox`/`option`).

## Testing

- Unit test files use `.test.tsx`, not `.spec.tsx`.
- Render the full app with `<AppWithProviders />` - it includes all providers, no manual wrapping needed.
- The localStorage preferences key is `vite-react:preferences`.
- Do not use conditional `expect()` calls - restructure the test to make assertions unconditional.

## Build output

- It is **prohibited** to add the `dist/` folder to `.gitignore`. The build output must remain trackable so the deploy pipeline and local previews work correctly.
- Before every commit you **MUST** verify that `vite.config.ts` reads `base` from `VITE_BASE_PATH` (currently `/my-portfolio-website/` in `.env`). The site is deployed to a GitHub Pages project page, so dropping or changing `base` will break all asset URLs in the deployed `index.html` and produce 404s for `/assets/*.js`, `/assets/*.css`, `/favicon.svg`, etc. The same `VITE_BASE_PATH` is also consumed by `playwright.config.ts` so the dev server URL stays in sync.
- Runtime asset paths stored as plain strings (e.g. in `domain/*-data.ts` or `<img src>`) must go through `publicAssetUrl()` from `@/modules/shared/lib/utils` - Vite rewrites HTML/JSX `src`/`href` attributes for you, but does not touch string literals in data files.

## CI pipeline

- Job order: `check` -> `unit-test` -> `e2e` -> `deploy`.
- `check` and `unit-test` run `ci:check` and `ci:test:unit` respectively.
- `deploy` only runs on `push` to `main` or `workflow_dispatch`.

## Commands

- `pnpm run dev` - start dev server
- `pnpm run types:check` - TypeScript type check
- `pnpm run check` - types + lint + format check
- `pnpm run fix` - lint + format fix
- `pnpm run test` - unit tests
- `pnpm run test:e2e` - Playwright E2E tests
- `pnpm run build` - production build
- `pnpm run deps:doctor` - full dependency health check (unused + circular + audit + outdated)
- `pnpm run ci:deps` - manual dependency audit (unused strict + security audit)
