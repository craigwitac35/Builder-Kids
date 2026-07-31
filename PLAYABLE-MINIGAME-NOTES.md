# Playable mini-game update

The **Gather Materials** doghouse step is now a hands-on mini-game.

## New interaction

1. Tap four scattered boards to load the truck.
2. Watch the truck counter fill from 0/4 to 4/4.
3. Choose the longest board for the final load.
4. Receive Builder Coins and continue to the next construction step.

## Code changes

- Added `src/components/GatherBoardsMiniGame.tsx`
- Added a `step-completed` game action for non-quiz mini-games
- Integrated the mini-game into the doghouse `gather` step
- Moved the render-time navigation dispatch into `useEffect`
- Added responsive mini-game styling to `src/app/globals.css`

## Testing note

`npm ci` could not complete in the provided environment because its internal npm mirror returned a 404 for `undici-types@6.21.0`. The changed source was manually checked, but a full Next.js production build should be run once dependencies are available.

If an old browser save has already progressed beyond Gather Materials, clear the site's local storage or finish/restart the doghouse to see the new step.
