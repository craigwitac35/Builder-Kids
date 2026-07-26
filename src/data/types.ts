/**
 * BUILDER KIDS — Core Data Schemas (Phase 1)
 * ------------------------------------------
 * Everything in the game is data-driven. Adding a new project, challenge,
 * or mini-game means adding entries here-shaped data — not writing new code.
 */

/* ---------------------------------- */
/* Challenge Bank                     */
/* ---------------------------------- */

/**
 * Challenge templates. Each type is a reusable engine; content is data.
 * 'select' covers both math problems and find-the-object (same interaction:
 * prompt + tap one of 2-4 options). 'matching-pairs' and 'sort-by-property'
 * are defined now so the schema doesn't change later, with engines to follow.
 */
export type ChallengeType = "select" | "matching-pairs" | "sort-by-property";

/** Skill tags — what a challenge teaches. Used to pull from the bank. */
export type SkillTag =
  | "counting"
  | "addition"
  | "subtraction"
  | "missing-addend"
  | "shape-id"
  | "measurement"
  | "comparison"
  | "counting-groups"
  | "tool-knowledge"
  | "safety";

export interface AnswerOption {
  id: string;
  label: string;
  /** Optional asset path (relative to /assets). Placeholder box renders if missing. */
  image?: string;
}

interface ChallengeBase {
  id: string;
  skill: SkillTag;
  /** Shown on screen AND used for read-aloud (speech synthesis later). */
  prompt: string;
  /**
   * Tiered help, drives the star system:
   *  [0] gentle visual/verbal hint        (used → capped at 2 stars)
   *  [1] narrow it down (removes option)  (still 2-star territory)
   *  [2] full walkthrough                 (used → 1 star)
   */
  hints: [string, string, string];
}

export interface SelectChallenge extends ChallengeBase {
  type: "select";
  options: AnswerOption[]; // 2–4, per UI rules
  correctOptionId: string;
}

export interface MatchingPairsChallenge extends ChallengeBase {
  type: "matching-pairs";
  pairs: { leftId: string; leftLabel: string; rightId: string; rightLabel: string }[];
}

export interface SortByPropertyChallenge extends ChallengeBase {
  type: "sort-by-property";
  buckets: { id: string; label: string }[];
  items: { id: string; label: string; correctBucketId: string }[];
}

export type ChallengeCard =
  | SelectChallenge
  | MatchingPairsChallenge
  | SortByPropertyChallenge;

/* ---------------------------------- */
/* Projects                           */
/* ---------------------------------- */

/** Resources a project can require / mini-games can earn. */
export type ResourceId = "boards" | "nails" | "paint" | "hammer" | "posts";

export type StepKind = "build" | "resource";

export interface ProjectStep {
  id: string;
  kind: StepKind;
  /** Shown in the top bar: "Step 2 of 5: Build the Walls" */
  title: string;
  /** For resource steps: which resource this mini-game earns. */
  resource?: ResourceId;
  /** Ordered challenge ids (from this project's challenge bank). */
  challengeIds: string[];
  /** Scene stage index to show once this step completes. */
  stageAfter: number;
  /** Builder Coins awarded on step completion. */
  rewardCoins: number;
}

export type CustomizationCategory = "paint" | "decoration" | "tool-skin";

export interface CustomizationOption {
  id: string;
  label: string;
  category: CustomizationCategory;
  /** Asset path relative to /assets (placeholder renders if file missing). */
  image: string;
  /** Hex from the locked Builder Kids palette (used for paint swatch UI). */
  color?: string;
}

export interface ProjectStage {
  index: number;
  label: string;
  /** Scene art path relative to /assets. */
  image: string;
}

export interface Project {
  id: string;
  name: string;
  /** One-to-two sentence character request, read aloud on the intro screen. */
  introText: string;
  /** Job-intro scene art (project-specific per locked decision #3). */
  introImage: string;
  /** Evolving construction scene, stage 0 = starting state. */
  stages: ProjectStage[];
  steps: ProjectStep[];
  /** This project's challenge cards (its slice of the bank). */
  challenges: ChallengeCard[];
  customization: CustomizationOption[];
  completionText: string;
  /** Badge id awarded on completion. */
  badgeId: string;
  badgeLabel: string;
}

/* ---------------------------------- */
/* Player State (persisted)           */
/* ---------------------------------- */

export interface ProjectProgress {
  /** Index into project.steps for an in-progress project. */
  stepIndex: number;
  /** Index into step.challengeIds within the current step. */
  challengeIndex: number;
  /** Highest scene stage reached. */
  stage: number;
  completed: boolean;
  /** 1–3, help-based (never time-based). Set on completion. */
  stars: number;
  /** Chosen customization option ids, by category. */
  customization: Partial<Record<CustomizationCategory, string>>;
  /** Per-challenge worst-help-used, for star math: 0 none, 1 hint, 2 walkthrough. */
  helpRecord: Record<string, 0 | 1 | 2>;
}

export interface PlayerState {
  /** Schema version — bump when shape changes so old saves migrate cleanly. */
  version: 1;
  coins: number;
  /** Earned resources (from resource mini-games). */
  inventory: Partial<Record<ResourceId, number>>;
  badges: string[];
  projects: Record<string, ProjectProgress>;
  settings: { soundOn: boolean };
}

export const initialPlayerState: PlayerState = {
  version: 1,
  coins: 0,
  inventory: {},
  badges: [],
  projects: {},
  settings: { soundOn: true },
};

export function initialProjectProgress(): ProjectProgress {
  return {
    stepIndex: 0,
    challengeIndex: 0,
    stage: 0,
    completed: false,
    stars: 0,
    customization: {},
    helpRecord: {},
  };
}
