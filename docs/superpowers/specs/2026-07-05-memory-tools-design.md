# Memory Tools — Design

Date: 2026-07-05
Repo: `/Users/charles/Workspace/perso/memory`

## Purpose

Two web tools to help me practice a memory peg system that associates each two-digit number (00–99) with a word:

1. **Peg List** — a reference sheet listing all 100 pairs, easy to consult.
2. **Peg Quiz** — a drill where a random number is shown and I type the associated word.

Modelled after `../guitar-tools`: same stack, same folder layout, same visual language and interaction patterns.

## Scope

**In:**

- Home page listing the two tools.
- `/peg-list` — read-only reference of 00–99 → word pairs.
- `/peg-quiz` — type-the-word drill with correct/wrong feedback.
- 100-entry peg list baked into source (`src/utils/pegs.ts`), seeded with the classic English Major System words.
- Case- and accent-insensitive answer matching.
- Random sampling with no immediate repeats.
- Installable PWA (mirrors guitar-tools' minimal setup: manifest + no-op service worker).

**Out (explicit YAGNI):**

- Reverse quiz (word → number).
- Persistence of any kind (no localStorage, no per-number stats, no wrong-answer log).
- Scoring, streaks, or session totals.
- Configurable range, weighted sampling, spaced-repetition.
- Search / filter on the peg list.
- French words baked in (schema stays identical; swap the file when ready).
- Offline caching (SW is intentionally no-op — installability only).
- PWA icons (iOS falls back to a screenshot; add later if a proper icon is wanted).
- Test runner setup — verify manually + rely on `tsc -b` and `eslint`.
- Deployment configuration beyond `_redirects` for SPA routing.

## Stack

Same as guitar-tools, same versions from its `package.json`:

- Vite 7
- React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- `react-router-dom` v7
- ESLint 9 with `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Node types (`@types/node`)

Package name: `memory-tools`. Scripts identical to guitar-tools: `dev`, `build` (`tsc -b && vite build`), `lint`, `preview`.

## File tree

```
memory/
├── .gitignore                 (copied verbatim from guitar-tools)
├── README.md                  (short, adapted from guitar-tools' README)
├── eslint.config.js           (copied verbatim)
├── index.html                 (copied; only <title> swapped to "Memory Tools")
├── package.json               (deps identical; name = "memory-tools")
├── tsconfig.json              (copied verbatim)
├── tsconfig.app.json          (copied verbatim)
├── tsconfig.node.json         (copied verbatim)
├── vite.config.ts             (copied verbatim)
├── docs/superpowers/specs/2026-07-05-memory-tools-design.md
├── public/
│   ├── _redirects             (/*    /index.html   200)
│   ├── manifest.json          (Memory Tools variant)
│   └── sw.js                  (no-op fetch handler)
└── src/
    ├── App.tsx                (BrowserRouter + 3 routes)
    ├── main.tsx               (React root + SW registration)
    ├── index.css              (Tailwind entry)
    ├── components/
    │   ├── Header.tsx         (copied verbatim from guitar-tools)
    │   └── ToolCard.tsx       (copied verbatim from guitar-tools)
    ├── pages/
    │   ├── Home.tsx
    │   ├── PegList.tsx
    │   └── PegQuiz.tsx
    └── utils/
        └── pegs.ts            (data + helpers)
```

Not brought over from guitar-tools: `Fretboard.tsx`, `metronomeAudio.ts`, `music.ts`, and the pages `ChordsQuiz`, `NoteFinder`, `Metronome`, `ScalePractice`.

## Routing

`src/App.tsx` structure mirrors guitar-tools' `App.tsx`:

- `/` renders `<Header />` + `<Home />`.
- `/peg-list` renders `<PegList />`.
- `/peg-quiz` renders `<PegQuiz />`.

Tool pages have their own compact back-arrow bar instead of the shared `Header`, matching guitar-tools' pattern (see `ChordsQuiz.tsx`).

## Visual language

- Dark theme: `bg-gray-950 text-gray-100 min-h-screen` on `<body>` (already in copied `index.html`).
- Same Tailwind palette used by guitar-tools: `gray-950/900/500/400/100`, accent `amber-500`, plus `emerald-500` for correct and `rose-500`/`rose-400` for wrong.
- Full-height layouts on tool pages: `flex flex-col h-[100dvh] overflow-hidden` container, compact header row, main content centered in remaining space — same as `ChordsQuiz.tsx`.

## Data model

`src/utils/pegs.ts`:

```ts
// index i (0..99) → the peg word for number i
export const PEGS: readonly string[] = [
  'sauce',  // 00
  'suit',   // 01
  'sun',    // 02
  // … 100 entries total, seeded from the classic English Major System
] as const;

export type PegNumber = number; // 0..99

export function formatNumber(n: PegNumber): string {
  return n.toString().padStart(2, '0');
}

export function normalize(s: string): string {
  // NFD decomposes accented characters; the range covers combining diacritical marks (U+0300..U+036F).
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function isCorrect(guess: string, n: PegNumber): boolean {
  return normalize(guess) === normalize(PEGS[n]);
}

export function randomPegNumber(exclude?: PegNumber): PegNumber {
  let n: PegNumber;
  do { n = Math.floor(Math.random() * 100); } while (n === exclude);
  return n;
}
```

Decisions:

- **Flat array indexed by number.** Lookup is `PEGS[n]`. No map, no keying by string.
- **Assumption:** `PEGS.length === 100`. The array literal enforces this by construction.
- **Answer matching** is case- and accent-insensitive (`.trim().toLowerCase().normalize('NFD').replace(...)`). Nothing more (no typo tolerance, no plural handling).
- **`randomPegNumber(exclude)`** avoids the immediately previous number, mirroring `pickChord(exclude)` in guitar-tools' `ChordsQuiz.tsx`.
- **Seed data**: the classic English Major System list found on Wikipedia and mnemonic sites (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh, 7=k/g, 8=f/v, 9=p/b; sample words: 00=sauce, 01=suit, 02=sun … 99=puppy). Any 100 English strings are acceptable — the whole point is that this file is trivially editable to swap in a personal French list later.

## Home page (`/`)

`src/pages/Home.tsx` follows guitar-tools' `Home.tsx` exactly, with two `ToolCard`s in `grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg`:

- Title: `Memory Tools`.
- Subtitle: `Practice your peg system`.
- Cards:
  - `Peg List` — `to="/peg-list"`, icon `📋`, description `Look up the word for any number 00–99`.
  - `Peg Quiz` — `to="/peg-quiz"`, icon `🎯`, description `Type the word that goes with a random number`.

`ToolCard.tsx` and `Header.tsx` are copied verbatim from guitar-tools.

## Peg list page (`/peg-list`)

`src/pages/PegList.tsx`.

- Compact top bar (back-arrow `←` linking to `/`, label "Peg List") — same style as guitar-tools' tool page headers.
- Body: scrollable vertical list, one row per pair, rendered via `PEGS.map((word, i) => …)`.
- Row layout:
  - Number on the left, monospaced feel via `tabular-nums`, `text-gray-500`, e.g. `07`.
  - Word on the right, `text-gray-100`, `text-lg`.
  - Row padding roughly `py-3 px-4`.
  - Zebra striping: `even:bg-gray-900/40`.
- Container: `max-w-md mx-auto` for comfortable reading on desktop and phone.
- No search, no filter, no interactivity beyond scroll and the back arrow.

## Peg quiz page (`/peg-quiz`)

`src/pages/PegQuiz.tsx`.

### State machine

Three states:

- `asking` — the number is displayed, the input is empty and focused, waiting for Enter/submit.
- `correct` — the guess matched. Green flash on the card. Auto-advance to a new number after 700 ms.
- `wrong` — the guess did not match. Red flash on the card. Input becomes read-only. The correct word is shown under the input. Advances to a new number on Enter, Space, or the "Next" button.

Advancing always: `n = randomPegNumber(prevN)`, clear input, set state to `asking`, refocus input.

### Layout (top to bottom, centered column)

- Compact top bar (back-arrow `←`, label "Peg Quiz").
- Small caption `Enter the word for` — uppercase, `tracking-wider`, `text-gray-400 text-xs sm:text-sm`.
- The number, `formatNumber(n)`, in `text-6xl sm:text-7xl font-bold` with `tabular-nums`. Always two digits.
- `<input>`:
  - Full width up to `max-w-md`, centered text at `text-2xl`.
  - `autoFocus`, `autoComplete="off"`, `autoCapitalize="off"`, `spellCheck={false}`.
  - Border color reflects state: neutral → emerald-500 → rose-500.
  - Read-only in the `wrong` state.
- One-line feedback area beneath the input, height reserved even when empty so nothing jumps:
  - `asking` → invisible spacer.
  - `correct` → invisible spacer (auto-advance is running).
  - `wrong` → `Correct answer: <word>` in `text-rose-400`.
- "Next" button visible only in the `wrong` state (styled like guitar-tools' amber action button).

### Keyboard

- Enter in `asking` → submit: call `isCorrect(input, n)`, transition to `correct` or `wrong`.
- Enter or Space in `wrong` → advance to the next number.
- In `asking`, Space is passed through to the input as an ordinary character (so multi-word answers work); it does not submit or advance.

### Non-goals for this page

No scoring counter, no streak indicator, no session totals, no history, no "skip" button.

## PWA

Same minimal, install-only PWA as guitar-tools. Not offline-capable.

- `public/manifest.json`:
  ```json
  {
    "name": "Memory Tools",
    "short_name": "Memory Tools",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#030712",
    "theme_color": "#030712"
  }
  ```
- `public/sw.js` — a single no-op fetch listener:
  ```js
  self.addEventListener('fetch', () => {});
  ```
- `src/main.tsx` — registers the service worker on startup, same snippet as guitar-tools' `main.tsx`.
- `index.html` — copied from guitar-tools with only `<title>` changed. This includes the `<link rel="manifest">`, `apple-mobile-web-app-capable`, and `theme-color` meta tags.
- `public/_redirects` — `/*    /index.html   200` for SPA routing on Netlify-style hosts.

No icons in the manifest for now; iOS uses a home-screen screenshot fallback.

## Testing

No test runner installed initially — this matches guitar-tools' precedent.

- **Automated safety net:** `tsc -b` and `eslint .` (already wired via the copied configs).
- **Manual verification** as part of implementation completion:
  - `npm run dev`, then click through Home → Peg List → Peg Quiz.
  - Peg list scrolls smoothly and shows all 100 rows.
  - Quiz shows a two-digit number and focuses the input.
  - Correct answer → green flash and auto-advance within ~700 ms.
  - Wrong answer → red flash + `Correct answer: <word>` shown.
  - Space or Enter advances after a wrong answer; Enter submits during `asking`.
  - Same number is never picked twice in a row (spot-check across ~20 rounds).
  - Accent/case insensitivity: try uppercase input, and if any seed word contains a diacritic (unlikely in the English list), verify it matches without the accent.
  - Install as PWA on a phone and confirm it launches standalone.

Vitest can be added the moment `pegs.ts` grows real logic (e.g. an SRS scheduler). Not now.

## Deployment

Not addressed by this spec beyond `_redirects`. `npm run dev` is the intended workflow; hosting choice is a separate decision.

## Success criteria

- Fresh clone → `npm install && npm run dev` boots on `localhost:5173` with no errors.
- All three routes render and navigate correctly.
- Peg list displays 100 rows.
- Quiz distinguishes correct vs wrong answers, resets cleanly, never immediately repeats a number.
- App is installable to home screen on iOS/Android via the manifest.
- `npm run build` and `npm run lint` both succeed.
