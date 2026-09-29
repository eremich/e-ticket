# Lessons Learned

<!-- Claude updates this file after every correction from the user. -->
<!-- This is the project's "memory" — patterns to remember and mistakes to avoid. -->
<!-- Claude reads this file at the start of each session. -->

## Format

Each entry follows this pattern:

```
### [Date] Short description
- **What happened**: What went wrong
- **Why**: Root cause
- **Rule**: What to do differently next time
```

## Lessons

_No lessons yet. When you correct Claude, it will record the pattern here to avoid repeating the mistake._

### [2026-09-29] Icon set: not Lucide by default
- **What happened**: The brief said Lucide; after step 1 the user asked for a different icon pack.
- **Why**: Lucide reads generic and has no filled weight, so the iOS outline/fill pairing (tab bar, badges) was impossible.
- **Rule**: For iOS-style prototypes use Phosphor (regular in UI, fill for selected tabs and colored badges). Keep one icon set, wrapped in `src/lib/icons.tsx` for custom glyphs.

### [2026-09-29] Restart Storybook after new utility families or token changes
- **What happened**: The metro map rendered all black in Storybook: `fill-*` / `stroke-*` classes were missing, although a fresh Tailwind build had them.
- **Why**: The running Storybook kept stale Tailwind output after tokens.js / first use of new utility families.
- **Rule**: When tokens.js changes or a new utility family appears, restart the Storybook (and dev) server before judging visuals.

### [2026-09-29] Dark theme: black, not the brief's blue-grey
- **What happened**: I used the brief's dark values (#0D141B canvas, #16202A surface). On Vercel the user found the dark theme too blue and asked for more black.
- **Why**: I treated the brief's dark palette as final, although the same lesson was learned on Patronim (neutral graphite, not tinted).
- **Rule**: Dark neutrals are always true black + iOS graphite (#000 / #1C1C1E / #2C2C2E / #38383A), even when a brief gives tinted values. Keep hue only on actions, selection and transport colors. Show the dark palette to the user before building screens on it.
