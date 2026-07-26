import type { Project } from "../types";

/**
 * LEVEL 1 — BUILD THE DOGHOUSE
 * Content transcribed from the approved level design doc.
 * Age 6–8 · addition/subtraction within 20 · shapes · measurement · sequence
 */
export const doghouse: Project = {
  id: "doghouse",
  name: "Build the Doghouse",
  introText: "Biscuit needs a new doghouse. Let's build one!",
  introImage: "scenes/screen-job-intro-doghouse-bg.png",
  badgeId: "first-build",
  badgeLabel: "First Build",
  completionText:
    "You measured, counted, and followed the blueprint. Biscuit has a new home!",

  stages: [
    { index: 0, label: "Empty yard", image: "scenes/project-doghouse-stage-00-empty-yard.png" },
    { index: 1, label: "Materials ready", image: "scenes/project-doghouse-stage-01-materials.png" },
    { index: 2, label: "Floor built", image: "scenes/project-doghouse-stage-02-floor.png" },
    { index: 3, label: "Walls up", image: "scenes/project-doghouse-stage-03-walls.png" },
    { index: 4, label: "Roof on", image: "scenes/project-doghouse-stage-04-roof.png" },
    { index: 5, label: "Finished!", image: "scenes/project-doghouse-stage-05-decorated.png" },
  ],

  steps: [
    {
      id: "blueprint",
      kind: "build",
      title: "Read the Blueprint",
      challengeIds: ["dh-roof-shape", "dh-count-walls"],
      stageAfter: 0,
      rewardCoins: 10,
    },
    {
      id: "gather",
      kind: "resource",
      resource: "boards",
      title: "Gather Materials",
      challengeIds: ["dh-boards-needed", "dh-load-boards", "dh-longest-board"],
      stageAfter: 1,
      rewardCoins: 15,
    },
    {
      id: "floor",
      kind: "build",
      title: "Build the Floor",
      challengeIds: ["dh-floor-boards", "dh-board-fit"],
      stageAfter: 2,
      rewardCoins: 20,
    },
    {
      id: "walls",
      kind: "build",
      title: "Build the Walls",
      challengeIds: ["dh-wall-boards", "dh-door-spot", "dh-straight-tool"],
      stageAfter: 3,
      rewardCoins: 25,
    },
    {
      id: "roof",
      kind: "build",
      title: "Add the Roof",
      challengeIds: ["dh-roof-left", "dh-rain-shape", "dh-builder-wear"],
      stageAfter: 4,
      rewardCoins: 30,
    },
  ],

  challenges: [
    /* ---- Step 1: Blueprint ---- */
    {
      id: "dh-roof-shape",
      type: "select",
      skill: "shape-id",
      prompt: "Which shape should we use for the roof?",
      options: [
        { id: "triangle", label: "Triangle" },
        { id: "square", label: "Square" },
        { id: "circle", label: "Circle" },
      ],
      correctOptionId: "triangle",
      hints: [
        "Look at the blueprint. The roof comes to a point at the top!",
        "A roof needs slanted sides so rain slides off. Which shape has slanted sides?",
        "The triangle has a point at the top and slanted sides — just like the roof in the blueprint. Tap the triangle!",
      ],
    },
    {
      id: "dh-count-walls",
      type: "select",
      skill: "counting",
      prompt: "How many walls does the plan show?",
      options: [
        { id: "3", label: "3" },
        { id: "4", label: "4" },
        { id: "5", label: "5" },
      ],
      correctOptionId: "4",
      hints: [
        "Count each wall on the blueprint. Front... back... and the sides!",
        "There's a front wall, a back wall, and one on each side. Count them one at a time.",
        "Front is 1, back is 2, left side is 3, right side is 4. The plan shows 4 walls!",
      ],
    },

    /* ---- Step 2: Gather Materials ---- */
    {
      id: "dh-boards-needed",
      type: "select",
      skill: "missing-addend",
      prompt: "We need 10 boards. There are 6 on the truck. How many more should we load?",
      options: [
        { id: "3", label: "3" },
        { id: "4", label: "4" },
        { id: "5", label: "5" },
      ],
      correctOptionId: "4",
      hints: [
        "Start at 6 and count up until you reach 10.",
        "6... 7, 8, 9, 10. How many numbers did you count after 6?",
        "6 plus 4 more makes 10. We need 4 more boards!",
      ],
    },
    {
      id: "dh-load-boards",
      type: "select",
      skill: "counting",
      prompt: "Tap the pile with 4 boards to load the truck!",
      options: [
        { id: "pile-3", label: "Pile of 3", image: "props/board-pile.png" },
        { id: "pile-4", label: "Pile of 4", image: "props/board-pile.png" },
        { id: "pile-5", label: "Pile of 5", image: "props/board-pile.png" },
      ],
      correctOptionId: "pile-4",
      hints: [
        "Count the boards in each pile, one at a time.",
        "One of these piles has exactly 4. Point to each board as you count: 1, 2, 3, 4.",
        "This pile has 1, 2, 3, 4 boards — exactly 4! Tap it to load the truck.",
      ],
    },
    {
      id: "dh-longest-board",
      type: "select",
      skill: "comparison",
      prompt: "Which board is longest?",
      options: [
        { id: "short", label: "Short board", image: "props/board-short.png" },
        { id: "medium", label: "Medium board", image: "props/board-exact.png" },
        { id: "long", label: "Long board", image: "props/board-long.png" },
      ],
      correctOptionId: "long",
      hints: [
        "Longest means it stretches the farthest from end to end.",
        "Compare two boards at a time. Which one sticks out past the others?",
        "This board stretches farther than both of the others — it's the longest one!",
      ],
    },

    /* ---- Step 3: Floor ---- */
    {
      id: "dh-floor-boards",
      type: "select",
      skill: "counting-groups",
      prompt: "The floor needs 2 rows of 4 boards. How many boards will we use?",
      options: [
        { id: "6", label: "6" },
        { id: "8", label: "8" },
        { id: "10", label: "10" },
      ],
      correctOptionId: "8",
      hints: [
        "Count the first row of 4, then keep counting through the second row.",
        "Row one: 1, 2, 3, 4. Now keep going in row two: 5, 6, 7...",
        "4 boards plus 4 more boards makes 8. The floor uses 8 boards!",
      ],
    },
    {
      id: "dh-board-fit",
      type: "select",
      skill: "measurement",
      prompt: "Which board fits this space?",
      options: [
        { id: "too-short", label: "Too short", image: "props/board-short.png" },
        { id: "exact", label: "Just right", image: "props/board-exact.png" },
        { id: "too-long", label: "Too long", image: "props/board-long.png" },
      ],
      correctOptionId: "exact",
      hints: [
        "Builders measure before they cut. The board should match the space exactly.",
        "Too short leaves a gap. Too long sticks out. Which one matches?",
        "This board is the same length as the space — a perfect fit! Tap the just-right board.",
      ],
    },

    /* ---- Step 4: Walls ---- */
    {
      id: "dh-wall-boards",
      type: "select",
      skill: "addition",
      prompt: "The front wall needs 5 boards. The side wall needs 4. How many boards altogether?",
      options: [
        { id: "8", label: "8" },
        { id: "9", label: "9" },
        { id: "10", label: "10" },
      ],
      correctOptionId: "9",
      hints: [
        "Start at 5, then count up 4 more.",
        "5... then 6, 7, 8, 9. What number did you land on?",
        "5 plus 4 equals 9. We need 9 boards altogether!",
      ],
    },
    {
      id: "dh-door-spot",
      type: "select",
      skill: "shape-id",
      prompt: "Where should the door go? Check the blueprint!",
      options: [
        { id: "front", label: "Front wall" },
        { id: "roof", label: "On the roof" },
        { id: "floor", label: "In the floor" },
      ],
      correctOptionId: "front",
      hints: [
        "Look at the blueprint. The small rectangle is the door.",
        "How would Biscuit walk in? Not through the roof or the floor!",
        "The blueprint shows the door on the front wall so Biscuit can walk right in. Tap the front wall!",
      ],
    },
    {
      id: "dh-straight-tool",
      type: "select",
      skill: "tool-knowledge",
      prompt: "Which tool should we use to check if the wall is straight?",
      options: [
        { id: "level", label: "Level", image: "props/tool-level.png" },
        { id: "paintbrush", label: "Paintbrush", image: "props/tool-paint-brush.png" },
        { id: "shovel", label: "Shovel" },
      ],
      correctOptionId: "level",
      hints: [
        "One of these tools has a little bubble that shows if something is straight.",
        "A paintbrush paints and a shovel digs. Which tool is left?",
        "A level helps builders check whether something is straight. Tap the level!",
      ],
    },

    /* ---- Step 5: Roof ---- */
    {
      id: "dh-roof-left",
      type: "select",
      skill: "subtraction",
      prompt: "We have 8 roof pieces. We used 3. How many are left?",
      options: [
        { id: "4", label: "4" },
        { id: "5", label: "5" },
        { id: "6", label: "6" },
      ],
      correctOptionId: "5",
      hints: [
        "Start at 8 and count backwards 3.",
        "8... 7, 6, 5. What number did you land on?",
        "8 take away 3 leaves 5. There are 5 roof pieces left!",
      ],
    },
    {
      id: "dh-rain-shape",
      type: "select",
      skill: "shape-id",
      prompt: "Which roof shape helps rain slide off?",
      options: [
        { id: "flat", label: "Flat roof" },
        { id: "sloped", label: "Sloped triangle roof" },
        { id: "bowl", label: "Bowl-shaped roof" },
      ],
      correctOptionId: "sloped",
      hints: [
        "Think about a slide at the playground. What makes things slide down?",
        "Rain sits still on a flat roof and collects in a bowl. What about slanted sides?",
        "A sloped triangle roof has slanted sides, so rain slides right off. Tap the sloped roof!",
      ],
    },
    {
      id: "dh-builder-wear",
      type: "select",
      skill: "safety",
      prompt: "What should the builder wear to stay safe?",
      options: [
        { id: "hard-hat", label: "Hard hat", image: "props/tool-safety-helmet.png" },
        { id: "party-hat", label: "Party hat" },
        { id: "crown", label: "Crown" },
      ],
      correctOptionId: "hard-hat",
      hints: [
        "Builders wear something strong to protect their head.",
        "A party hat is for birthdays and a crown is for kings. What do builders wear?",
        "A hard hat protects a builder's head on the job. Tap the hard hat!",
      ],
    },
  ],

  customization: [
    { id: "paint-red", label: "Friendly Red", category: "paint", image: "customization/paint-doghouse-red.png", color: "#FF5E5E" },
    { id: "paint-blue", label: "Sky Blue", category: "paint", image: "customization/paint-doghouse-blue.png", color: "#6EC6FF" },
    { id: "paint-yellow", label: "Sunny Yellow", category: "paint", image: "customization/paint-doghouse-yellow.png", color: "#FFD34D" },
    { id: "deco-flag", label: "Flag", category: "decoration", image: "customization/decoration-doghouse-flag.png" },
    { id: "deco-bone-sign", label: "Bone Sign", category: "decoration", image: "customization/decoration-doghouse-bone-sign.png" },
  ],
};
