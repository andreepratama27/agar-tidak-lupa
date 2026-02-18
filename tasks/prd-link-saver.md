# PRD: Agar Tidak Lupa — Link Saver

## Introduction

Agar Tidak Lupa ("So I Don't Forget") is a minimalist personal link saver. Users paste any URL, the app auto-fetches its title and favicon, assigns a predefined label, and saves it to a Convex database. The interface follows a Neo Brutalism design system — bold borders, flat colors, minimal chrome. No authentication; single-user, open access.

## Goals

- Let users save any URL in under 3 seconds
- Auto-fetch link metadata (title, favicon) so users don't type anything extra
- Organize links with a small set of predefined labels
- Provide a clean, scannable list of saved links
- Keep the UI truly minimal — one page, no navigation

## User Stories

### US-001: Define link and label schemas in Convex

**Description:** As a developer, I need a database schema to persist links and their labels so data survives across sessions.

**Acceptance Criteria:**
- [ ] Create a `links` table with fields: `url` (string), `title` (string), `favicon` (optional string), `label` (string — one of the predefined values), `savedAt` (number, epoch ms)
- [ ] Remove the demo `todos` and `products` tables from `convex/schema.ts`
- [ ] Create Convex query `links:list` that returns all links ordered by `savedAt` descending
- [ ] Create Convex mutation `links:add` that accepts `url`, `title`, `favicon`, and `label`
- [ ] Create Convex mutation `links:remove` that accepts a link `_id` and deletes it
- [ ] Typecheck passes (`npx tsc --noEmit`)

### US-002: Build the link input form

**Description:** As a user, I want to paste a URL and pick a label so I can save a link quickly.

**Acceptance Criteria:**
- [ ] A single input field for URL at the top of the page with placeholder "Paste a link..."
- [ ] A label selector showing predefined labels (e.g., Article, Video, Tool, Reference, Inspiration, Other)
- [ ] A "Save" button that submits the form
- [ ] On submit: auto-fetch the page title and favicon from the URL, then call `links:add`
- [ ] Input clears after successful save
- [ ] Disabled state on the Save button while fetching metadata
- [ ] Neo Brutalism styling: bold 2px black borders, flat background colors, no rounded corners or minimal rounding
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-003: Auto-fetch link metadata

**Description:** As a user, I want the app to automatically grab the page title and favicon so I don't have to type them manually.

**Acceptance Criteria:**
- [ ] Create a Convex HTTP action or use a client-side fetch to retrieve the `<title>` and favicon from a given URL
- [ ] If metadata fetch fails (CORS, timeout, etc.), fall back to using the URL hostname as the title and no favicon
- [ ] Favicon extracted from `<link rel="icon">` or fallback to `https://www.google.com/s2/favicons?domain=HOSTNAME`
- [ ] Metadata fetching completes within 5 seconds (timeout)
- [ ] Typecheck passes

### US-004: Display saved links list

**Description:** As a user, I want to see all my saved links in a clean list so I can find and revisit them.

**Acceptance Criteria:**
- [ ] Each link card shows: favicon (16×16), title, truncated URL, label badge, and a delete button
- [ ] Clicking the title/URL opens the link in a new tab (`target="_blank"`, `rel="noopener noreferrer"`)
- [ ] Links ordered newest first
- [ ] Empty state message when no links are saved (e.g., "No links saved yet. Paste one above!")
- [ ] Neo Brutalism styling: cards with bold borders, label badges with flat colored backgrounds
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Delete a saved link

**Description:** As a user, I want to delete a link I no longer need so my list stays clean.

**Acceptance Criteria:**
- [ ] Each link card has a delete icon button (use `Trash2` from lucide-react)
- [ ] Clicking delete immediately removes the link (calls `links:remove`) — no confirmation dialog needed for minimal UX
- [ ] Link disappears from the list in real time (Convex reactivity)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Clean up demo/scaffold files

**Description:** As a developer, I need to remove the demo files that came with the TanStack starter so the codebase only contains link-saver code.

**Acceptance Criteria:**
- [ ] Remove `src/routes/demo/` directory
- [ ] Remove `convex/todos.ts`
- [ ] Update `src/routes/index.tsx` to render the link saver UI
- [ ] Update `src/routes/__root.tsx` if it references demo content
- [ ] App loads without errors on `npm run dev`
- [ ] Typecheck passes

## Functional Requirements

- FR-1: The `links` table stores `url`, `title`, `favicon` (optional), `label`, and `savedAt` fields
- FR-2: Predefined labels are: **Article**, **Video**, **Tool**, **Reference**, **Inspiration**, **Other**
- FR-3: When a user submits a URL, the system fetches the page's `<title>` tag and favicon before saving
- FR-4: If metadata fetch fails, the system uses the URL's hostname as the title and Google's favicon service as fallback
- FR-5: The link list displays all saved links in reverse chronological order
- FR-6: Each link can be deleted with a single click
- FR-7: The entire app lives on a single page (`/`) — no multi-page routing needed
- FR-8: All data is persisted in Convex and updates in real time

## Non-Goals

- No user authentication or multi-user support
- No link editing (title, URL, or label) after saving
- No search or filter functionality
- No folders, collections, or nested organization
- No import/export of links
- No browser extension
- No drag-and-drop reordering

## Design Considerations

- **Design system:** Neo Brutalism — bold black borders (2px+), flat saturated colors, minimal or no border-radius, strong drop shadows (`4px 4px 0px black`), high contrast
- **Typography:** System font stack, bold headings
- **Layout:** Single column, centered, max-width ~640px
- **Label badges:** Each label gets a distinct flat background color (e.g., Article=blue, Video=red, Tool=green, Reference=yellow, Inspiration=purple, Other=gray)
- **Icons:** Use `lucide-react` exclusively (already installed)
- **Responsive:** Works on mobile — single column naturally adapts

## Technical Considerations

- **Convex schema:** Replace existing demo tables (`todos`, `products`) with `links` table
- **Metadata fetching:** Convex HTTP actions can fetch external URLs server-side (avoids CORS). Alternatively, use Google's favicon API (`https://www.google.com/s2/favicons?domain=...&sz=32`) as a reliable favicon source
- **Real-time updates:** Convex queries are reactive by default — the link list will auto-update when data changes
- **Existing components:** Reuse `src/components/Header.tsx` if applicable, or replace with a simple app title

## Success Metrics

- User can save a link in under 3 seconds (paste URL → pick label → click save)
- Saved links render with correct title and favicon on first load
- Delete removes link instantly with no page refresh
- Page loads in under 1 second on a broadband connection

## Open Questions

- Should labels be stored as a separate table for future extensibility, or is a string union sufficient for this minimal scope?
- Should there be a visual confirmation (toast/animation) after saving a link?
