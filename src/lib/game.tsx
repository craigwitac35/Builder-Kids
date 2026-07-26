"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  initialProjectProgress,
  type CustomizationCategory,
  type PlayerState,
  type ProjectProgress,
} from "@/data/types";
import { getProject, projects } from "@/data/registry";
import { loadState, saveState } from "./storage";

/* ---------------------------------- */
/* Screen flow                        */
/* ---------------------------------- */

export type Screen =
  | { name: "title" }
  | { name: "job-intro"; projectId: string }
  | { name: "gameplay"; projectId: string }
  | { name: "customize"; projectId: string }
  | { name: "complete"; projectId: string }
  | { name: "collection" };

interface GameState {
  player: PlayerState;
  screen: Screen;
  hydrated: boolean;
}

type Action =
  | { type: "hydrate"; player: PlayerState }
  | { type: "go"; screen: Screen }
  | { type: "start-project"; projectId: string }
  | {
      type: "challenge-solved";
      projectId: string;
      challengeId: string;
      helpUsed: 0 | 1 | 2;
    }
  | { type: "choose-customization"; projectId: string; category: CustomizationCategory; optionId: string }
  | { type: "finish-project"; projectId: string }
  | { type: "toggle-sound" };

/* ---------------------------------- */
/* Star math (help-based, never time) */
/* ---------------------------------- */

export function starsFromHelp(helpRecord: Record<string, 0 | 1 | 2>): number {
  const worst = Math.max(0, ...Object.values(helpRecord));
  if (worst === 0) return 3; // no help anywhere
  if (worst === 1) return 2; // hints used
  return 1; // walkthrough used
}

/* ---------------------------------- */
/* Reducer                            */
/* ---------------------------------- */

function progressFor(player: PlayerState, projectId: string): ProjectProgress {
  return player.projects[projectId] ?? initialProjectProgress();
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "hydrate":
      return { ...state, player: action.player, hydrated: true };

    case "go":
      return { ...state, screen: action.screen };

    case "start-project": {
      const prev = progressFor(state.player, action.projectId);
      const progress = prev.completed ? initialProjectProgress() : prev;
      return {
        ...state,
        screen: { name: "gameplay", projectId: action.projectId },
        player: {
          ...state.player,
          projects: { ...state.player.projects, [action.projectId]: progress },
        },
      };
    }

    case "challenge-solved": {
      const project = getProject(action.projectId);
      if (!project) return state;
      const prev = progressFor(state.player, action.projectId);
      const step = project.steps[prev.stepIndex];
      if (!step) return state;

      const helpRecord = { ...prev.helpRecord, [action.challengeId]: action.helpUsed };
      let { stepIndex, challengeIndex, stage } = prev;
      let coins = state.player.coins;
      let screen: Screen = state.screen;

      if (challengeIndex + 1 < step.challengeIds.length) {
        challengeIndex += 1;
      } else {
        // Step complete: award coins, advance scene stage.
        coins += step.rewardCoins;
        stage = Math.max(stage, step.stageAfter + 1);
        challengeIndex = 0;
        stepIndex += 1;
        if (stepIndex >= project.steps.length) {
          // All build steps done → customization.
          screen = { name: "customize", projectId: project.id };
        }
      }

      const progress: ProjectProgress = {
        ...prev,
        helpRecord,
        stepIndex,
        challengeIndex,
        stage: Math.min(stage, project.stages.length - 1),
      };
      return {
        ...state,
        screen,
        player: {
          ...state.player,
          coins,
          projects: { ...state.player.projects, [project.id]: progress },
        },
      };
    }

    case "choose-customization": {
      const prev = progressFor(state.player, action.projectId);
      const progress: ProjectProgress = {
        ...prev,
        customization: { ...prev.customization, [action.category]: action.optionId },
      };
      return {
        ...state,
        player: {
          ...state.player,
          projects: { ...state.player.projects, [action.projectId]: progress },
        },
      };
    }

    case "finish-project": {
      const project = getProject(action.projectId);
      if (!project) return state;
      const prev = progressFor(state.player, action.projectId);
      const progress: ProjectProgress = {
        ...prev,
        completed: true,
        stage: project.stages.length - 1,
        stars: starsFromHelp(prev.helpRecord),
      };
      const badges = state.player.badges.includes(project.badgeId)
        ? state.player.badges
        : [...state.player.badges, project.badgeId];
      return {
        ...state,
        screen: { name: "complete", projectId: project.id },
        player: {
          ...state.player,
          badges,
          projects: { ...state.player.projects, [project.id]: progress },
        },
      };
    }

    case "toggle-sound":
      return {
        ...state,
        player: {
          ...state.player,
          settings: { soundOn: !state.player.settings.soundOn },
        },
      };

    default:
      return state;
  }
}

/* ---------------------------------- */
/* Context                            */
/* ---------------------------------- */

interface GameApi {
  state: GameState;
  dispatch: (a: Action) => void;
}

const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    player: { ...loadStateSafe() },
    screen: { name: "title" },
    hydrated: false,
  });

  // Hydrate from localStorage on mount (client only).
  useEffect(() => {
    dispatch({ type: "hydrate", player: loadState() });
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (state.hydrated) saveState(state.player);
  }, [state.player, state.hydrated]);

  const api = useMemo(() => ({ state, dispatch }), [state]);
  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

function loadStateSafe() {
  // During SSR/prerender this returns the initial state; real save loads in useEffect.
  return loadState();
}

export function useGame(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}

export { projects };
