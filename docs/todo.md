# Task Plan

Style: impeccable (brief tokens are the contract)

## Current Task — Eticket 2026 clickable prototype

Sources: `eticket-prototype-brief.md`, `eticket-case-foundation.md` (Downloads). Case study is written after the prototype.

### Decisions
- Stack as Patronim: Vite + React + TS, Tailwind v3 from `src/design-system/tokens.js`, React Router, Zustand, Playwright.
- Icons: Phosphor (user asked to replace Lucide). Regular in UI, fill for selected tabs and badges. Trolleybus is a custom glyph in `src/lib/icons.tsx`. Storybook 10 (same as Patronim) instead of 8.
- Font: SF Pro on Apple, Roboto (variable, Cyrillic) everywhere else, so Windows screenshots are deterministic.
- AA: `brand` #1487D6 with white is 3.8:1, so filled buttons use `action` (darker) and dark theme puts dark text on light brand. Transport fills get an `on-*` text color.
- Metro line colors: 1 red, 2 blue, 3 green, always with an "M" badge and line number.
- Original case images stay in `src/` for now (moving them was blocked); nothing imports them.
- SF Pro is installed on this machine, so local screenshots render in SF Pro (Roboto is the fallback elsewhere).

### Steps
- [x] 1. Foundations: tokens, theme, i18n EN/UK, formats, Storybook, base components with stories, phone shell
- [x] 2. EticketCard, ArrivalChip, TapResult, RouteOption with stories
- [x] 3. Home, stop and line detail, map mode, metro map, timetable
- [x] 4. Pay for a ride and Card flows
- [x] 5. Routes: search, saved / recent, options with filters and fare, detail with balance check, live trip on the metro map (transfer card, get-off push, arrival → Home onward "Tram 7 · 4 min"), service-change banner. `scripts/flow-commute.mjs` runs brief 5.8 end to end.
- [x] 6. Onboarding and visitor (built by a Sonnet subagent, reviewed; `scripts/flow-onboarding.mjs`). Expired visitor ticket only via store flag, wired in step 8.
- [x] 7. Profile and special cases (Sonnet subagent, finished and reviewed by me; `scripts/flow-profile.mjs` 43 frames, 0 errors).
- Miro flows (board uXjVHhQTOfI) checked 29 Sep: covered. Gaps accepted as non-critical by the user: no-location search, walk-to-stop directions, Google Pay/Wallet, declined push, rides-left on visitor ticket, save-after-arrival, city picker (one city only).
- [x] 8. Scenario wiring (`?scenario=` + desk picker), `npm run shots` (29 PNG, 1170 × 2532), `npm run build` (app + Storybook), self-review against brief §12

## Review

- Brief 5.8 morning commute works by clicking from a fresh load (`scripts/flow-commute.mjs`); pay, onboarding and profile flows have their own checks in `scripts/`.
- Scenarios (brief §9): default, low-balance, declined, offline, no-live-data, visitor, visitor-expired, lost-card, new-user, double-charge, new-phone, fare-expiring, service-change, plastic-to-phone. Extra shot-only states: paid, on-trip, visitor-ticket.
- Storybook is the DS source of truth: tokens (colors with live contrast, transport code, type, formats, shape, motion) and every component with EN/UK and light/dark stories.
- Steps 6 and 7 were built by Sonnet subagents and reviewed; the user stopped the second one near the end and I finished the check.
- Known, accepted as non-critical: see the Miro gap list above. Storybook bundle warns about chunk size (docs only).


## Completed

- Eticket prototype, 29 Sep 2026.
