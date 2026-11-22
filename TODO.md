# Animulog — Work List

A prioritised list of bugs, fixes, improvements and features, ordered from **most to least important**.
Work top to bottom where you can; the tiers are explained below.

## How to use this file

- `- [ ]` = not done, `- [x]` = done. Tick an item in the same commit that finishes it.
- **IDs are permanent.** Never renumber. New items go at the end of their tier with the next free number (e.g. `B12`).
- If an item is partly done, leave it unticked and add a `> Progress:` line under it saying what's left.
- If an item turns out to be wrong or unwanted, change it to `- [x] ~~title~~` and add a `> Dropped:` line with the reason.
- File paths are relative to the repo root. Line hints (`~L218`) are approximate; they drift as code changes, so search for the function name if the line doesn't match.
- **Picking an item up in a new AI chat:** point the AI at this file and the item ID, e.g. *"Read TODO.md and implement D1. Tick it when done."* Each item is written to be understandable on its own.

### Tiers

| Tier | Meaning |
|------|---------|
| **D** — Data safety | Can lose or corrupt library data, or breaks the build. Do these first. |
| **C** — Core | Broken or missing behaviour you'll hit in normal use. |
| **B** — Smaller bugs | Real bugs, but narrower or less frequent. |
| **I** — Foundations | Refactors that make everything after them easier. Best done before the features. |
| **L** — Cleanup | Consistency, hygiene and small gaps. |
| **F** — Features | New functionality (only items that have been agreed on). |

---

## D — Data safety

- [x] **D1 · Changing an entry's franchise can delete another franchise**
  - **Problem:** New franchises get the id `fr_of_<entryId>` (`franchiseIdFor`). If entry A creates franchise "X", entry B joins "X", and A is then moved to a new franchise "Y", the new "Y" reuses the id of "X" and overwrites it. "X" disappears and B is left without a franchise.
  - **Where:** `apps/server/src/routes/entries.ts`, `PUT /:id/franchise` (~L218); `franchiseIdFor` in `apps/server/src/models/ids.ts` (~L47).
  - **Fix:** Create new franchises with `newFranchiseId(Object.keys(data.franchises))`. Remove `franchiseIdFor` once nothing uses it.
  - **Done when:** the A/B/X/Y scenario above leaves "X" intact with B in it.

- [x] **D2 · Backups made in the same minute overwrite each other; restoring can destroy the backup**
  - **Problem:** Backup filenames only go down to the minute (`animu-YYYYMMDDHHMM.json`). Two backups in one minute share a name. Restoring a backup from the current minute first writes the "safety backup" over that same file, so the restore copies the current data back onto itself and the chosen backup is lost.
  - **Where:** `apps/server/src/utils/backup.ts` — `createBackup` (~L15), `restoreBackup` (~L48), `BACKUP_FILENAME` regex.
  - **Fix:** Add seconds and milliseconds to the filename, and refuse to overwrite an existing file (`fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL)`, or add a suffix). ~~Update `BACKUP_FILENAME` so it accepts both the old 12-digit names and the new ones.~~
  > Done differently: the 4 existing 12-digit backups were renamed to the 17-digit format (`00000` appended) instead of supporting both formats, so `BACKUP_FILENAME_PATTERN` only accepts 17 digits. Also fixed: on Windows `copyFileSync` keeps the source file's modified time, so backups showed the wrong date; `createBackup` now sets it with `fs.utimesSync`, and the renamed backups had their modified time set to the time in their name.
  - **Done when:** two backups taken within one second produce two files, and restoring the newest backup works.

- [x] **D3 · Data writes aren't atomic, and data paths depend on the working directory**
  - **Problem:** `writeAnimuData`/`writeSettings` write directly over the file, so a crash or power loss mid-write leaves a truncated `animu.json`. All data paths are `./src/database/...`, so they only work if the server is started from `apps/server`.
  - **Where:** `apps/server/src/utils/fileUtils.ts` (`DATA_FILE`, `SETTINGS_FILE`, `writeAnimuData`, `writeSettings`); `apps/server/src/utils/backup.ts` (`DATA_FILE`, `BACKUP_DIR`).
  - **Fix:** Write to `<file>.tmp`, then `fs.renameSync` it over the real file. Build paths from the module location (`path.join(import.meta.dirname, "../database/...")`), defined once and shared by both files.
  - **Done when:** writes go through a temp file + rename, and the server works when started from the repo root.

- [ ] **D4 · Updating an entry saves whatever fields the browser sends**
  - **Problem:** The entry update route spreads the request body straight into storage, so any extra field gets saved. This is already happening: search results add a `displayTitle` field (`useEntrySearch` returns its own `{ ...entry, displayTitle }` copies), and editing an entry reached from a search saves it. One entry in the current data has it. Settings `PUT` and the source `PUT` (which stores AniList's `format` field) have the same problem.
  - **Where:** `apps/server/src/routes/entries.ts` `PUT /:id` (~L131) and `PUT /:id/source` (~L260); `apps/server/src/routes/settings.ts` (~L31); `apps/frontend/src/hooks/useEntrySearch.ts` (~L37, ~L57).
  - **Fix:**
    - Server: build the saved object from an explicit list of allowed fields, the way `POST /entries` already does. Do the same for settings and sources.
    - Frontend: make `useEntrySearch` return the original `Entry` objects rather than its internal search copies.
    - Clean-up: in `readAnimuData`, delete any stray `displayTitle`/`displayCover` keys so the existing bad entry heals itself on its next save.
  - **Done when:** sending an extra field to any of these routes doesn't end up in `animu.json`.

- [ ] **D5 · Folder name casing differs between disk and git — the build breaks on Linux/macOS**
  - **Problem:** Git tracks `apps/frontend/src/components/layout/Sidebar/` and `.../Toolbar/`, but the folders on disk and the imports in `Layout.tsx` (~L3-4) use `sidebar`/`toolbar`. Windows doesn't care; a clone on any case-sensitive system fails to resolve the imports.
  - **Fix:** Rename in git in two steps, because a case-only rename doesn't register on Windows. Shown for Sidebar; do the same for Toolbar:
    `git mv apps/frontend/src/components/layout/Sidebar apps/frontend/src/components/layout/sidebar_tmp`, then `git mv apps/frontend/src/components/layout/sidebar_tmp apps/frontend/src/components/layout/sidebar`.
  - **Done when:** `git ls-files apps/frontend/src/components/layout` shows lowercase `sidebar/` and `toolbar/`.

---

## C — Core

- [ ] **C1 · Applying an AniList match by hand silently fails for some titles**
  - **Problem:** `validateEntrySource` requires a non-empty English title, Japanese title and synopsis. AniList often has no native title or no description for obscure or unreleased entries, so the manual picker's save is rejected with a 400 and nothing tells you. The batch job doesn't validate, so the same match saves fine there.
  - **Where:** `apps/server/src/utils/validators.ts` `validateEntrySource` (~L222-230).
  - **Fix:** Require `japaneseTitle` and `synopsis` to be strings, but allow them to be empty. Keep `englishTitle` required (the mapper already falls back to the romaji title). Error visibility is handled by C5.
  - **Done when:** a candidate with an empty synopsis or native title can be applied from the picker.

- [ ] **C2 · Identify "Unsorted" (and other system sections) by a fixed id, not by name**
  - **Problem:**
    - Entries that aren't in any section are folded into the section *labelled* "Unsorted" (`withUnsortedFallback`).
    - Nothing stops you renaming or deleting that section. If you do, new entries created from the Library page or an import stop appearing in any section.
    - The `system` flag is set on 7 sections but has no effect anywhere.
  - **Where:** `apps/server/src/utils/fileUtils.ts` `withUnsortedFallback` (~L45); `apps/server/src/routes/sections.ts` `PUT /:id` and `DELETE /:id`; `systemSectionId()` in `apps/server/src/models/ids.ts`.
  - **Fix:**
    - One-time migration in `readAnimuData`: if no `sec_sys_unsorted` exists, re-key the section labelled "Unsorted" to `systemSectionId("unsorted")` (or create it if it's missing).
    - Make the fallback look the section up by that id.
    - Decide what `system` means; suggested: system sections can be renamed but not deleted. Enforce that on the server and hide the Delete button in the UI.
  - **Why it's better:** the section can be renamed safely, lookups are a direct `sections[id]`, and the frontend can link to or check Unsorted by a known id.
  - **Done when:** renaming Unsorted keeps unsectioned entries showing in it, and deleting a system section is refused.

- [ ] **C3 · Moving an entry between sections should be one request**
  - **Problem:** A move is two separate requests: remove the entry from the old section, then add it to the new one. If the second request fails, the entry is removed from the old section but never added to the new one. The frontend also builds both requests from possibly stale section data.
  - **Where:** `apps/frontend/src/hooks/useAnime.ts` `useMoveEntryToSection` (~L51-66).
  - **Fix:** Add `POST /api/animu/entries/:id/move` with body `{ targetSectionId }`. In a single write, it removes the entry from every manual section and appends it to the target. Point `useMoveEntryToSection` at it, and add an optimistic update like the other mutations have.
  - **Done when:** a move is one request and one file write.

- [ ] **C4 · Partial updates (PATCH) instead of sending the whole entry**
  - **Problem:** Every quick action (progress +1, status, media type) sends a full copy of the entry. Two actions in flight can overwrite each other with stale values, and this is also how D4's stray fields get in.
  - **Where:** `apps/server/src/routes/entries.ts`; `apps/frontend/src/hooks/useAnime.ts` (`useAdjustEntryProgress`, `useUpdateEntryMediaType`, `useUpdateEntry`, `useUpdateEntryStatus`); `apps/frontend/src/services/animuService.ts`.
  - **Fix:** Add `PATCH /api/animu/entries/:id`, which accepts any subset of the editable fields, validates only the fields it was sent, and merges them in. The server sets `timestamps.updated` itself (see B10). Switch the frontend mutations to send only what changed. Keep the old `PUT` until nothing uses it, then remove it.
  - **Done when:** quick actions send only the field they change.

- [ ] **C5 · Show errors to the user (toasts)**
  - **Problem:**
    - No failed save is ever shown. Optimistic updates roll back silently.
    - The service functions throw generic messages and throw away the server's `message`.
    - `handleExport` and `handleFileSelected` in Settings can throw unhandled promise rejections.
  - **Where:** `apps/frontend/src/main.tsx` (QueryClient), `apps/frontend/src/services/*.ts`, `apps/frontend/src/pages/SettingsPage.tsx`.
  - **Fix:**
    - Add a small toast system: a context and portal, or a tiny library such as `sonner`.
    - Give the `QueryClient` a `MutationCache` with a global `onError` that shows a toast.
    - Add one shared `request()` helper in `services/` that reads `{ message }` from error responses and throws it. Use it for every call.
    - Wrap the Settings export and import handlers in try/catch.
  - **Done when:** a rejected save shows a toast with the server's message.

- [ ] **C6 · Record started / finished / dropped dates automatically**
  - **Problem:** No code anywhere sets `firstStarted`, `lastStarted`, `firstFinished`, `lastFinished`, `lastDropped` or `finishedCount`, and none of the existing entries have them. As a result, all of these show nothing: "Date Started/Finished" sorting, the started/finished/dropped filters, the "finished" line in the activity chart, and the rewatch statistics.
  - **Principle:** dates are filled in automatically from status changes; the user never has to set them. **Status and episode progress stay independent:** changing progress never changes the status or any date, and changing status never touches progress. A user may leave Watching or Watched with progress incomplete because they'll continue from where they left off.
  - **Rules** (applied when the status *changes*; setting the same status again does nothing):

    | Change | Effect |
    |--------|--------|
    | Watched → Watching | A rewatch starts: `lastStarted = now`. |
    | Unsorted / Backlog / Dropped → Watching | A watch starts: `lastStarted = now`; `firstStarted` is set too if it's empty. |
    | On Hold → Watching | A resume, not a new start: no date changes. |
    | Anything → Watched | `lastFinished = now`; `firstFinished` set if empty; `finishedCount += 1`. |
    | Anything → Dropped | `lastDropped = now`. |
    | New entry created as Watched | `finishedCount = 1`, dates left empty (it was probably watched in the past). |
    | New entry created as Watching | `lastStarted` and `firstStarted` = now. |

    Rewatch count stays `finishedCount - 1`, so no separate "Rewatch" button is needed.
  - **Undo guard:**
    - If an entry's status is changed back to its previous value within **5 minutes**, restore the timestamps from before the first change. That way a mis-click (e.g. accidentally setting Watched, then switching back) doesn't count as a finish or rewatch.
    - Keep the "before" snapshot in an in-memory map on the server, keyed by entry id: `{ at, previousStatus, previousTimestamps }`. Losing it on a server restart is fine.
  - **Where it runs:**
    - On the server, in one helper (e.g. `applyStatusChange(entry, newStatus, now)` in a new `apps/server/src/services/statusHistory.ts`).
    - Call it from every route that can change status: entry `PUT`/`PATCH` (C4), entry create, and text-import commit (B1). Then it behaves the same from cards, the panel and imports.
    - Set `timestamps.updated` here too (B10).
  - **One-time backfill** in `readAnimuData`: every entry with status Watched and `finishedCount === 0` gets `finishedCount = 1`, with its dates left empty (shown as "Unknown").
  - **Manual corrections (optional, never required):**
    - Add a **"Watch history"** section at the bottom of the entry edit panel (`EntryDetailBody.tsx`), **collapsed by default**.
    - It holds date inputs for first/last started, first/last finished and last dropped, plus a number input for times finished. Empty dates show as "Unknown".
    - Saving these edits sends the timestamps directly and does **not** run the status rules.
  - **Done when:**
    - Status changes fill in the dates as in the table above.
    - Reverting a status within 5 minutes leaves the dates as they were.
    - The existing Watched entries count as finished once.
    - The Date Started/Finished sorts, the activity chart and the rewatch stats start showing data.

- [ ] **C7 · Favorite toggle on existing entries**
  - **Problem:** You can only set favorite when creating an entry. The Favorites page says "Mark entries as favorite to see them here", but there's no way to do it.
  - **Constraint:** don't change the look or flow of the cards.
  - **Fix:**
    - Grid cards: add a star button to the existing hover overlay, next to the other actions, so it only appears on hover like they do.
    - List and detail rows: add it to the existing actions row.
    - Side panel and detail page: make it clickable next to the status badge or in the actions row.
    - Leave the existing star badge on covers as an indicator only.
    - Save with `useUpdateEntry({ patch: { favorite } })` (or the PATCH from C4).
  - **Done when:** favorite can be toggled from cards, rows and the panel, and the cards look unchanged when not hovered.

- [ ] **C8 · A fresh clone doesn't run, and the docs are stale**
  - **Problem:**
    - Data files are gitignored and there's no seed, so a fresh clone 500s on every request.
    - The auto-backup check (`copyFileSync` inside `setInterval`) crashes the server when `animu.json` is missing.
    - The root README is one line, the frontend README is the Vite template, and `apps/server/src/database/SCHEMAS.md` still describes the old Jikan format.
  - **Where:** `apps/server/src/utils/fileUtils.ts` `readAnimuData`, `apps/server/src/utils/backup.ts`, `README.md`, `apps/frontend/README.md`, `SCHEMAS.md`.
  - **Fix:**
    - If `animu.json` is missing, create the database folder and an empty library containing the system Unsorted section (see C2).
    - Make backup creation skip cleanly when there's no data file.
    - Write a README covering prerequisites, `npm install`, `npm run dev` / `npm run stop`, ports (3001/5173), where the data lives, the `.env` file and backups.
    - Replace the frontend README.
    - Rewrite `SCHEMAS.md` for the current model, or delete it and point to `apps/server/src/models/`.
  - **Done when:** deleting `animu.json` and starting the server gives an empty, working app.
  > Progress: the code part is done — a missing `animu.json` creates the database folder and an empty library with the system Unsorted section (`sec_sys_unsorted`), and auto-backup skips cleanly with no data file. Remaining: the root README, the frontend README, and `SCHEMAS.md`.

- [ ] **C9 · Linting is broken; fix the config, then the 19 findings**
  - **Problem:**
    - Both `eslint.config.js` files use `__dirname`, which doesn't exist in ES modules, so `npm run lint` crashes immediately.
    - The frontend config also points `parserOptions.project` at `tsconfig.json`, which contains only references and no files.
    - The server config uses browser globals instead of Node's.
  - **Fix:**
    - Configs: replace `__dirname` with `import.meta.dirname`, and use `projectService: true` instead of `project`. In the server config, use `globals.node`.
    - Frontend findings to fix after that:
      - `react-hooks/refs` — refs read during render in `EntryDetailPanel.tsx`, `ImageLightbox.tsx`, `useAnchoredPanel.ts`.
      - `react-hooks/set-state-in-effect` — `useEntryEditor.ts`, `SectionIndexPage.tsx`, `SourceManagerPage.tsx`.
      - Memoization and missing effect dependency in `SourceManagerPage.tsx` (~L525-530).
      - Unused destructured `source` in `useAnime.ts` (×4) and `_format` in `SourceMatchPicker.tsx`.
      - `any` in `useEntrySearch.ts`.
      - Unneeded `isLoading` dependencies in `SidebarBody.tsx` and `SidebarHeader.tsx`.
      - Fast-refresh export warnings in `EntryRenderer.tsx` and `EntryPanelContext.tsx`.
    - Server finding: unused `_format` in `services/anilist.ts`. Allow `_`-prefixed unused variables in the config, or restructure the code.
  - **Done when:** `npm run lint` passes in both apps.

---

## B — Smaller bugs

- [ ] **B1 · Text import/export problems**
  - **Where:** `apps/server/src/routes/textLog.ts`, `apps/frontend/src/pages/SettingsPage.tsx`.
  - **Problems and fixes:**
    - **Tabs or newlines in titles/notes break the export** (2 current notes contain them). Escape them on export (`\t` → `\\t`, `\n` → `\\n`) and unescape on import.
    - **`/import/commit` doesn't validate rows.** Check each row: title is a non-empty string, status and media type are valid values, numbers are ≥ 0 or null, favorite is a boolean. Return a 400 that names the bad rows.
    - **Editing the title of an "Update" row is ignored.** Either apply the new title or make the title read-only for matched rows.
    - **The same unmatched title twice in one file creates duplicates.** Flag duplicates in the preview.
    - **You can't remove a row from the preview.** Add a remove button.

- [ ] **B2 · Validation crashes on wrong types instead of returning 400**
  - **Problem:** `isValidString` calls `.trim()` on any value, so sending `title: 123` throws and returns a 500.
  - **Where:** `apps/server/src/utils/validators.ts` (~L15).
  - **Fix:** `typeof value === "string" && value.trim().length > 0`. Check the other helpers for the same problem.

- [ ] **B3 · Settings number fields save on every keystroke and can't be cleared**
  - **Problem:** Each keystroke sends a settings save, and emptying a field snaps it to 1, so you can't clear it and type a new number.
  - **Where:** `apps/frontend/src/pages/SettingsPage.tsx` (~L285, ~L305).
  - **Fix:** Keep the value as local text while typing; validate and save on blur or Enter.

- [ ] **B4 · "Fetch All" can undo matches you picked by hand, and auto-matching is weak**
  - **Problem:** The batch job re-searches every entry by title, so "Fetch All" can replace a correct match you picked by hand. The best match is simply the first result with the right format, with no title or year check.
  - **Where:** `apps/server/src/services/sourceJobs.ts` `runJob` (~L113-135); `apps/server/src/services/anilist.ts` `pickBestMatch` (~L147).
  - **Fix:**
    - For entries that already have an AniList source, refresh by id with a `Media(id: …)` query instead of searching.
    - For title search, score candidates by normalised title similarity (English, romaji, native and synonyms) plus format. If nothing scores above a threshold, log the entry as "skipped — low confidence, pick manually" instead of saving a guess.
    - While in this file: remove finished jobs from the in-memory `jobs` map after a while.

- [ ] **B5 · Deleting an entry leaves references behind**
  - **Problem:** Relations that point to the deleted entry stay in the data, and franchises left with no entries aren't deleted. The franchise route does delete empty franchises, so the two behave differently.
  - **Where:** `apps/server/src/routes/entries.ts` `DELETE /:id` (~L162-168).
  - **Fix:** Also filter out `data.relations` where `from` or `to` is the deleted id, and delete franchises that end up empty.

- [ ] **B6 · Escape closes several layers at once**
  - **Problem:** Pressing Escape in the cover viewer also closes the side panel, because both listen on `document`. Form and confirm dialogs don't respond to Escape at all.
  - **Where:** `apps/frontend/src/components/ui/ImageLightbox.tsx` (~L26), `apps/frontend/src/components/entry/EntryDetailPanel.tsx` (~L68), `FormDialog.tsx`, `ConfirmDialog.tsx`.
  - **Fix:** Keep a small "layer stack" (a context or module-level array) so only the topmost open layer handles Escape. Register the dialogs in it too.

- [ ] **B7 · Dialogs close when a text selection is dragged outside them**
  - **Problem:** Closing is triggered by `onClick` on the backdrop. If you press the mouse inside the dialog (e.g. selecting text in an input) and release it outside, the click lands on the backdrop and the dialog closes, losing what you typed.
  - **Where:** `FormDialog.tsx` (~L21), `ConfirmDialog.tsx`, `ImageLightbox.tsx`, and the side panel's `Backdrop`.
  - **Fix:** Close only when both `mousedown` and `mouseup` happen on the backdrop itself. Track the `mousedown` target in a ref.

- [ ] **B8 · Statistics page errors**
  - **Where:** `apps/frontend/src/utils/computeStatistics.ts`.
  - **Problems and fixes:**
    - **"Top Franchises" is always empty.** It's built from `relations` (there are none) instead of your stored franchises (~L185). Use `animu.franchises`, ranked by `entryIds.length`.
    - **Media type labels show as `FILM`, `SPECIAL`, etc.** (~L151). Use `MEDIA_TYPE_LABELS`.
    - **Metadata coverage counts legacy placeholder sources as fetched** (~L196). Use `!needsSourceFetch(entry)`.

- [ ] **B9 · Score and progress aren't range-checked**
  - **Problem:** The rating input says 1–10, but any number is accepted on both sides. A negative number is rejected by the server and rolls back silently. Progress can go above the episode total.
  - **Where:** `apps/frontend/src/hooks/useEntryEditor.ts` `handleSave` (~L73); `apps/server/src/utils/validators.ts` (~L132).
  - **Fix:** Server: score is null or between 1 and 10; progress is a whole number ≥ 0. Frontend: clamp the values before saving. Optionally, stop the +1 button at the episode total when it's known.

- [ ] **B10 · The server trusts the browser's "last updated" time**
  - **Problem:** `timestamps.updated` is taken from whatever the client sends.
  - **Fix:** The server sets `timestamps.updated = Date.now()` on every entry write. The client stops sending it. Do this alongside C4.

- [ ] **B11 · Inconsistent server responses**
  - **Where:** `apps/server/src/routes/entries.ts`, `sections.ts`, `franchises.ts`.
  - **Problems and fixes:**
    - Entry `PUT` and `DELETE` return 201; they should return 200 (or 204).
    - Entry `PUT` logs "Error creating entry" on failure.
    - The rename messages have the old and new names swapped (`sections.ts` ~L182, `franchises.ts` ~L92).
    - The section-label duplicate check is case-sensitive while the franchise one isn't. Make both case-insensitive.
    - `POST /sections` doesn't return the new section's id. Return it, like `POST /entries` does.
    - `PUT /sections/:id/entries` doesn't check that the entry ids exist. Ignore or reject unknown ids.

---

## I — Foundations

- [ ] **I1 · Shared types package for frontend and server**
  - **Problem:** Both apps define the same models and constants separately, and they've already drifted apart: two different sort-key vocabularies (`added` vs `addedAt`), status lists defined twice, and `ViewMode` living inside a component file.
  - **Fix:**
    - Add a workspace package (e.g. `packages/shared`, named `@animulog/shared`) containing the model types, constants (statuses, media types, group types, relation kinds, labels) and pure helpers (`resolveEntry`, `needsSourceFetch`).
    - Make both apps import from it, and settle on one set of sort keys.
    - Do this before the F-tier features, which add more model fields.

- [ ] **I2 · Shared page layout and list controls**
  - **Problem:**
    - Library, Section, Favorites, Search and Franchise pages each copy the same header, count badge, toolbar row, entry grid and empty state, as styled-components.
    - They also behave differently: Favorites, Search and Franchise pages ignore the default sort and view mode from Settings; Library and Section pages apply them.
  - **Fix:**
    - Extract a `PageHeader`, `EntryGrid` and `EmptyState` component.
    - Add a `useListControls()` hook that owns search, filters, sort and view mode and applies the defaults from Settings.
    - Use them on every list page. The Sections, Franchises and Settings pages can reuse the header and empty state too.
  - **Done when:** every list page applies the default sort and view, and the copied styled blocks are gone.

- [ ] **I3 · Keep search, filters, sort and view in the URL**
  - **Fix:** Have `useListControls()` (from I2) read and write `useSearchParams`, so a reload or a shared link keeps the current view. Do after I2.

- [ ] **I4 · Accessibility basics**
  - **Fix:**
    - Dialogs (`FormDialog`, `ConfirmDialog`, `ImageLightbox`, the side panel): add `role="dialog"`, `aria-modal`, a label, a focus trap, and return focus to the trigger on close.
    - Clickable `div`s (e.g. the grid card in `EntryGridItem.tsx`) become buttons or get keyboard handlers.
    - Covers get `alt` text.
    - Hover-only action rows also appear on `:focus-within`, so keyboard users can reach them.

- [ ] **I5 · Cache AniList search results**
  - **Problem:** Reopening the match picker repeats the same AniList search, which uses up the rate limit.
  - **Fix:** Set `staleTime` (e.g. 10 minutes) in `useSourceSearch` (`apps/frontend/src/hooks/useSources.ts`).

- [ ] **I6 · Add tests**
  - **Problem:** There are no tests anywhere.
  - **Fix:** Add Vitest to both apps. First targets:
    - the validators;
    - text-log parse/export round-trips, including tabs and newlines;
    - `sortEntries`, `applyEntryFilters`, `computeStatistics`, `buildIndex`;
    - the data migrations in `readAnimuData`;
    - the D1 franchise scenario.

---

## L — Cleanup

- [ ] **L1 · Remove the temporary diagnostics**
  - **Where:** `apps/server/src/server.ts` (~L9-22: `BOOT_ID`, the `X-Server-Boot` header, and the boot id in the startup log); `apps/server/src/services/sourceJobs.ts` `getJob` warning (~L34).

- [ ] **L2 · Dependency and leftover-file hygiene**
  - **Server:** move `@types/*`, `typescript`, `nodemon` and `ts-node` to `devDependencies`. Remove the unused `uuid`. Fix `"main": "server.ts"` (should be `src/server.ts`, or remove it).
  - **Root:** move `@tanstack/react-query` from the root `package.json` to `apps/frontend/package.json`.
  - **Frontend:**
    - Remove Tailwind (`tailwindcss`, `@tailwindcss/vite`, and the plugin in `vite.config.ts`); it's installed but never used.
    - Delete the unused template files: `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`.
    - Delete the empty `src/services/api.ts`.
    - Give `index.html` a proper `<title>`.

- [ ] **L3 · Breadcrumb fixes**
  - **Where:** `apps/frontend/src/components/layout/toolbar/Breadcrumb.tsx` (~L65).
  - **Problems and fixes:**
    - Entries that aren't in a section show an "N/A" crumb linking to `/sections/N/A`. Leave the section crumb out when there's no section.
    - Search, Favorites, Statistics, Settings and Source Manager pages show only "Overview". Add crumbs for them.

- [ ] **L4 · Naming and display consistency**
  - **Problems and fixes:**
    - The sidebar says "Dashboard" but the page and breadcrumb say "Overview". Pick one.
    - Order boxes on cards and section tiles start at 0. Display `index + 1` and convert back when saving.
    - The section dialog says "Rename Section" even when you're only changing the description or group. Call it "Edit Section".

- [ ] **L5 · One set of status colours**
  - **Problem:** Status colours are defined three times with slightly different values.
  - **Where:** `apps/frontend/src/types/status.ts`, `components/entry/EntryDetailBody.tsx` (~L66), `components/entry/EntryDetailItem.tsx` (~L24).
  - **Fix:** Use `STATUS_COLORS` everywhere. Derive the background and border shades with `color-mix()`.

- [ ] **L6 · Backup management**
  - **Problem:** Backups are never cleaned up (6 files and about 5 MB so far), and you can't delete or download one.
  - **Fix:**
    - Add a retention setting, e.g. "keep the last N automatic backups". Never auto-delete manual or safety backups, or count them separately.
    - Add `DELETE /api/animu/backups/:filename` and a download route.
    - Add Delete and Download buttons on the Settings page.

---

## F — Features

- [ ] **F1 · Relations from AniList → franchise suggestions, watch order and "Next up"**
  - **Constraint:** don't become dependent on AniList. AniList is only used to *suggest* relations; everything is stored locally and keeps working if AniList is unreachable or goes away.
  - **Plan:**
    - When a source is fetched (manually or by batch), add `relations { edges { relationType node { id } } }` to the same query, so there are no extra requests.
    - Save relations as local `Relation` records, but only between entries that are already in your library (matched by `source.externalId`).
    - Map AniList relation types onto `RelationKind`: SEQUEL and PREQUEL become `sequel` (inverted for prequel), plus SIDE_STORY, SPIN_OFF, ADAPTATION and ALTERNATIVE; everything else becomes `related`.
    - Let you add and remove relations by hand in the entry panel, so you never need AniList for them.
  - **What it adds:**
    - **Franchise suggestions:** on the Franchises page, groups of related entries that aren't in a franchise yet, with an Accept button that creates the franchise.
    - **Watch order:** a franchise's default order follows the sequel chain, falling back to air date. A manual reorder still wins.
    - **"Next up":** on an entry's page, the first sequel you haven't watched.
  - **Depends on:** I1 is recommended first.

- [ ] **F2 · "Find on AniList" button in the Add Entry dialog**
  - **Constraint:** search only when the button is clicked, never while typing.
  - **Plan:**
    - Add a "Find on AniList" button next to the title field. It opens the existing `SourceMatchPicker` with the typed title.
    - Choosing a candidate pre-fills the media type (from its format) and remembers the match.
    - After the entry is created, apply the match with `PUT /entries/:id/source`.
    - The dialog works exactly as it does now if you don't use the button.

- [ ] **F3 · Drag-and-drop reordering**
  - **Where it applies:** entries in a manual section, a franchise's watch order, and sections within a group on the Sections page.
  - **Plan:**
    - Use a library such as `@dnd-kit/core` + `@dnd-kit/sortable`.
    - Only enable dragging when the sort is "Custom order" and no search or filter is active; otherwise show a short hint explaining why.
    - Keep the number boxes as a keyboard-friendly alternative.

- [ ] **F4 · "Surprise me" — random pick from the backlog**
  - **Plan:** a button in the toolbar of list pages (Library, Section, Favorites, Search). It picks a random entry from the list currently shown, so it respects your search and filters (e.g. filter to films first), and opens it in the side panel with a "Pick again" button.

- [ ] **F5 · Richer statistics: hours watched and year in review**
  - **Plan:**
    - **Hours watched:** add AniList's `duration` (minutes per episode) to the source query and an optional `episodeDuration` field on `EntrySource` (null for legacy sources). Hours watched = Σ progress × duration, with a note when some entries have no duration.
    - **Year in review:** a year selector on the Statistics page showing, for that year: entries finished, episodes, hours, top genres and studios, highest-rated, and the first and last thing finished.
  - **Depends on:** C6 (finish dates) for the year-in-review part.

- [ ] **F6 · Smart sections (sections that fill themselves from a rule)**
  - **What it is:** a section whose contents come from a rule instead of being added by hand. Examples: "Watched but unrated", "Favourite films", "Aired 2020 or later", "Backlog OVAs". The data model already has smart sections (`kind: "smart"` with `filter` and `sort`), but nothing works out which entries match and there's no way to create one. Today `sectionEntryIds()` in `apps/frontend/src/types/section.ts` returns `[]` for them.
  - **Plan:**
    - **Rules:** use the filter fields the filter menu already has: statuses, media types, favorite, genres, studios, tags, score range, aired range, and "not in any manual section".
      - The server's `EntryFilter` and the frontend's `EntryFilters` are currently different shapes. Settle on one, ideally in the shared package (I1).
    - **Working out membership:** do it on the frontend with `applyEntryFilters` + `sortEntries` (all the data is already loaded). Make `sectionEntryIds()`, or a replacement that takes the entries, return the real list, so counts are correct in the sidebar, the Overview and the Sections page.
    - **Creating and editing:**
      - The Create Section dialog gets a Manual / Smart choice.
      - Smart shows a rule editor (reuse the filter menu's controls), a sort choice, and a live "N entries match" count.
      - Editing a smart section's rules goes through the same dialog. Add a server route to update `filter`/`sort`, and validate the filter contents on the server.
    - **How they behave:**
      - Smart sections show a small "Smart" badge.
      - They can't be "Move" targets (already true).
      - They have no custom order, so they hide the order boxes.
      - An entry can appear in a smart section *and* its manual section at the same time.
      - The Unsorted fallback only looks at manual sections.

- [ ] **F7 · Bulk select and bulk actions**
  - **Plan:**
    - **Selecting:**
      - A "Select" toggle in the toolbar of list pages (Library, Section, Favorites, Search, Franchise).
      - While it's on, cards show a small checkbox in a corner. Clicking a card selects or deselects it instead of opening it. Shift-click selects everything between the last click and this one.
      - Esc or toggling "Select" off clears the selection, and so does leaving the page.
    - **Actions:** a bar fixed to the bottom of the page shows *"N selected · Move to section · Set status · Set type · Add to franchise · Fetch source · Favorite / Unfavorite · Delete · Clear"*.
      - Delete asks for confirmation.
      - Fetch source starts the existing batch job with the selected ids.
      - Set status goes through C6's status rules.
    - **Server:** one request per action, e.g. `POST /api/animu/entries/bulk { entryIds, action, value }`, done as a single file write.
  - **Depends on:** C3 (atomic move) and C4 (partial updates).

- [ ] **F8 · Keyboard shortcuts and a quick-jump search (command palette)**
  - **Plan:**
    - **Ctrl+K** opens a search box from anywhere. Typing fuzzy-finds entries, sections, franchises and pages; Enter opens the result.
    - The same box runs commands, e.g. "Add entry", "Open Settings", "Fetch missing sources".
    - **Single keys:**
      - `/` focuses the page's search box.
      - `+` / `-` change episodes while an entry's side panel is open.
      - `?` shows a list of all shortcuts.
    - Shortcuts are ignored while typing in an input or textarea.
  - **Keyboard layouts (important):** not everyone uses a US layout. The owner uses Icelandic, where `/` is Shift+7 and characters like `@ { } [ ] \` need AltGr.
    - Match character shortcuts on `event.key` (the character produced), not `event.code` (the physical key position). Then `/` works however a layout types it.
    - Never use shortcuts that need AltGr characters. Never use Ctrl+Alt combinations: on Windows, AltGr is sent as Ctrl+Alt, so these clash with normal typing.
    - Letter shortcuts with Ctrl (like Ctrl+K) are safe on layouts that have that letter. Avoid ones the browser already uses (Ctrl+P, Ctrl+F, Ctrl+L, …).
    - Show every shortcut in the `?` overlay, and ideally let them be rebound in Settings.

- [ ] **F9 · Import a list from MyAnimeList or AniList** — *lowest priority; do last.*
  - **What it is:** bring an existing list from those sites into Animulog (one-way, into Animulog only).
  - **Plan:**
    - **MAL:** upload the XML file from MAL's list export.
      - Status mapping: Watching → watching, Completed → watched, On-Hold → on_hold, Dropped → dropped, Plan to Watch → backlog.
      - Score, episodes watched, start/finish dates (MAL's `0000-00-00` means unknown) and times rewatched (becomes `finishedCount`) come across.
    - **AniList:** type a username and fetch that user's public anime list in one `MediaListCollection(userName, type: ANIME)` query. It includes status, score, progress, `startedAt`/`completedAt`, `repeat` and the media id.
    - **Sources:** attach them by exact id, with no title guessing. AniList items already have the AniList id. MAL items are looked up in batches with `Page { media(idMal_in: [...], type: ANIME) }`, 50 per request, using the existing rate limiter.
    - **Review screen:** reuse the text-import preview. Match existing entries by source id first, then by title; show New / Update and let rows be edited or removed before committing.
    - Imported dates are written directly and do **not** run C6's status rules.
