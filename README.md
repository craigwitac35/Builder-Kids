# Builder Kids — Build · Learn · Create

Educational construction game for ages 6–8. Kids complete building projects
(doghouse, fence, more to come) by solving math and building challenges, then
customize and collect what they've built.

## Status

Phase 1 (data architecture) + Phase 2 (engine/screens) complete, with the
select-challenge template (Phase 3, partial) working — the full Doghouse level
is playable end to end with placeholder art.

- ✅ Data schemas: challenge bank, projects, player state (`src/data/types.ts`)
- ✅ Doghouse content fully scripted (`src/data/projects/doghouse.ts`)
- ✅ All six screens: title, job intro, gameplay, customize, complete, collection
- ✅ Wrong-answer ladder (shake → hint → remove option → walkthrough), never punitive
- ✅ Help-based star system (3 = no help, 2 = hint, 1 = walkthrough) — no timers
- ✅ LocalStorage save (swappable persistence layer in `src/lib/storage.ts`)
- ✅ Placeholder art system — drop real PNGs into `public/assets/` and they
  replace the labeled boxes automatically (see `public/assets/README.md`)
- ⚠️ Fence content NOT yet written (structure stubbed in `src/data/projects/fence.ts`)
- ⚠️ Matching-pairs and sort-by-property challenge engines: schema defined, UI pending
- ⚠️ Sound, read-aloud (speech synthesis), and coin shop: pending

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out (app-shell-ready for Capacitor later)
```

## Adding art

Use the exact filenames from the execution plan's asset list. Any missing file
renders as a labeled dashed box in-game; adding the file replaces it instantly.

## Adding content

New projects are data, not code: create `src/data/projects/yourproject.ts`
shaped like `doghouse.ts` and register it in `src/data/registry.ts`. A project
with steps + challenges is automatically playable.
