
import type { Project } from "../types";

/**
 * LEVEL 2 — REPAIR THE FENCE
 * ⚠️ CONTENT NOT YET WRITTEN (Phase 5).
 * Structure is real; challenge cards below are placeholders so the project
 * renders as "locked/coming soon" in the collection. Final challenge content
 * (exact prompts, numbers, hints) still needs to be authored — see the
 * execution plan. Do NOT unlock this project until content is finalized.
 */
export const fence: Project = {
  id: "fence",
  name: "Repair the Fence",
  introText: "The backyard fence is broken. Can you fix it?",
  introImage: "scenes/screen-job-intro-fence-bg.png",
  badgeId: "fence-fixer",
  badgeLabel: "Fence Fixer",
  completionText: "You cleared, measured, and hammered. The fence is good as new!",

  stages: [
    { index: 0, label: "Broken fence", image: "scenes/project-fence-stage-00-broken.png" },
    { index: 1, label: "Area cleared", image: "scenes/project-fence-stage-01-cleared.png" },
    { index: 2, label: "Posts installed", image: "scenes/project-fence-stage-02-posts.png" },
    { index: 3, label: "Boards attached", image: "scenes/project-fence-stage-03-boards.png" },
    { index: 4, label: "Fence painted", image: "scenes/project-fence-stage-04-painted.png" },
    { index: 5, label: "Decorated", image: "scenes/project-fence-stage-05-decorated.png" },
  ],

  // TODO(Phase 5): real step list + challenge cards.
  steps: [],
  challenges: [],

  customization: [
    {
      id: "paint-white",
      label: "White",
      category: "paint",
      image: "customization/paint-fence-white.png",
      color: "#F4EFE6",
      sceneVariant: "scenes/project-fence-stage-05-decorated-white.png",
    },
    {
      id: "paint-brown",
      label: "Wood Brown",
      category: "paint",
      image: "customization/paint-fence-brown.png",
      color: "#9A6B3F",
      sceneVariant: "scenes/project-fence-stage-05-decorated-brown.png",
    },
    {
      id: "paint-blue",
      label: "Sky Blue",
      category: "paint",
      image: "customization/paint-fence-blue.png",
      color: "#6EC6FF",
      sceneVariant: "scenes/project-fence-stage-05-decorated-blue.png",
    },
    { id: "deco-flowers", label: "Flowers", category: "decoration", image: "customization/decoration-fence-flowers.png" },
    { id: "deco-sign", label: "Sign", category: "decoration", image: "customization/decoration-fence-sign.png" },
  ],
};
