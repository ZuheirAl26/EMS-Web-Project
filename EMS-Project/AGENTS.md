# EMS Frontend Agent Guide

## Scope

These instructions apply to this Vite application and every directory below
it. The package root is this directory. Run all package commands here.

The Git repository may resolve to the parent `EMS Web Project` directory, so
always inspect `git status` before editing and preserve unrelated changes.

## Product

This project is the frontend for an Exhibition Management System serving
visitors, exhibitors, and administrators. It includes:

- A public Damascus International Fair landing page
- Exhibitor registration, login, Google authentication, and account recovery
- Future exhibitor and administrator dashboards
- A future interactive exhibition floor map

## Technology

- React 19 and TypeScript 6
- Vite 8
- React Router 7
- TanStack Query for server state
- Zustand for persisted client/authentication state
- Axios for API requests
- i18next for English and Arabic
- SCSS with shared CSS custom properties
- Hugeicons and local SVG/image assets

In PowerShell, use the Windows command shim because `npm.ps1` may be blocked:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
npm.cmd run preview
```

Run both build and lint before handing off code. Do not claim the repository is
green unless both commands pass.

## Current source structure

```text
src/
  api/                         Shared Axios client and interceptors
  assets/                      Source images and logos
  components/                  Shared UI primitives
    Button/
    ConfirmDialog/
    EmptyState/
    Input/
    Loader/
    Modal/
    Table/
  context/                     Language and theme Zustand stores
  features/
    ExhibitorAuth/             Exhibitor authentication feature
      api/
      components/
      hooks/
      pages/
      utils/
    landing page/              Public landing-page feature
      component/
        BlogSection/
        ExhibitionSection/
        FeaturesSection/
        Footer/
        HeroSection/
        Icon/
        LogoMark/
        MapPreview/
        MapSection/
        MobileAppSection/
        PlanSection/
        SiteNav/
      pages/
        LandingPage.tsx
        landingData.ts
  layouts/                     Structural layout wrappers
  locales/{en,ar}/             i18next resources
  router/                      Routes and authentication guards
  store/                       Persisted authentication store
  styles/                      Global theme and landing-page tokens
  types/                       Global TypeScript declarations
  utils/                       i18next and shared utilities
```

The `landing page` directory currently contains a space. Preserve that exact
path while working on existing changes. Do not rename or reorganize it as part
of an unrelated feature.

## Architecture conventions

- Keep domain code inside its feature. Add cross-feature code to
  `src/components`, `src/api`, `src/types`, or `src/utils` only when it is
  genuinely reusable.
- Use the shared components exported from `src/components/index.ts` before
  introducing feature-local duplicates.
- Components use PascalCase filenames. Hooks use `useXxx.ts`.
- Keep a component's SCSS beside the component.
- Prefer type-only imports where appropriate because
  `verbatimModuleSyntax` is enabled.
- Keep page and component exports in the nearest `index.ts` when one exists.
- Preserve existing user edits and avoid broad formatting or directory
  changes.

## State and API conventions

- Put remote state and mutations in TanStack Query hooks.
- Use Zustand only for durable client state such as authentication, language,
  and theme.
- Send HTTP requests through `src/api/ApiClient.tsx`.
- Feature API functions must use explicit request and response types and return
  `response.data`.
- The Axios request interceptor reads the bearer token from
  `useAuthStore.getState()`.
- Authentication persists under `exhibitor-auth-storage`.
- Narrow API errors with `axios.isAxiosError`; do not introduce explicit
  `any`.
- Never commit `.env`. Required keys currently include `VITE_API_URL` and
  `VITE_GOOGLE_CLIENT_ID`.

## Landing-page conventions

- `/` renders `src/features/landing page/pages/LandingPage.tsx`.
- Page sections are composed from small components rather than one monolithic
  page file.
- Reuse the data arrays and `LandingIconName` type in `landingData.ts`.
- Reuse CSS tokens from `src/styles/global.scss`.
- Keep anchor IDs stable because the navigation links depend on them:
  `home`, `exhibition`, `floor-map`, `plan`, `features`, `blog`, and `contact`.
- Keep the visitor mobile-app promotion between the floor-map section and the
  about/exhibition section when implementing the approved Figma order.
- The main floor-plan area is reserved for a future interactive map. Keep that
  content area white and do not hard-code a final booth map unless explicitly
  requested.
- Preserve responsive behavior and verify narrow/mobile layouts.

## Localization and accessibility

- User-facing content should be represented in both English and Arabic.
- When adding another i18next namespace, update `src/utils/i18n.ts` and
  `src/types/i18next.d.ts` together.
- Preserve RTL layout behavior for Arabic.
- Use semantic landmarks, headings in order, labels for form fields, and
  accessible names for icon-only controls.
- Buttons that navigate should normally be links; buttons should represent
  actions.

## Routing

- Public landing page: `/`
- Guest authentication: `/login`, `/register`, `/check-email`,
  `/verify-email`
- Modal routes: `/forgot-password`, `/reset-password`, `/change-password`
- Protected placeholder: `/dashboard`

Password routes use React Router background-location state so they can appear
as modals over login. Preserve that behavior.

`GuestRoute` and `ProtectedRoute` exist, but their wrappers are currently
commented out in `AppRouter.tsx`. Do not enable them without checking the full
authentication flow.

## Current baseline and continuation point

- The landing page and shared UI components exist and have uncommitted edits.
  Treat those edits as user work.
- Authentication flows are mostly implemented.
- `useExhibitorProfile.ts` imports a missing `api/ProfileApi` module. Do not
  invent endpoints or response types; obtain the backend contract first.
- The project currently has known TypeScript/lint failures involving the
  missing profile API, unused authentication values, explicit `any`, effect
  state updates, and currently unused route guards.
- The safest continuation is:
  1. Preserve and finish the current landing-page work.
  2. Match the approved Figma section order and keep the map area reserved.
  3. Verify desktop, tablet, mobile, and RTL rendering.
  4. Restore the authentication build/lint baseline without guessing APIs.
  5. Finish the exhibitor profile contract and page.
  6. Replace the dashboard placeholder with feature modules.

## Change discipline

- Inspect `git status` and relevant diffs before editing.
- Never overwrite unrelated uncommitted files.
- Keep changes limited to the requested feature.
- Do not add `dist`, local environment files, repository snapshots, or
  generated caches.
- Do not rename case-sensitive paths casually; Windows can hide casing bugs
  that fail in Linux/CI.
