import type { ChallengeCard, Project, ProjectProgress } from "./types";
import { doghouse } from "./projects/doghouse";
import { fence } from "./projects/fence";

/** All projects, in unlock order. A project is playable when steps exist. */
export const projects: Project[] = [doghouse, fence];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function isPlayable(p: Project): boolean {
  return p.steps.length > 0 && p.challenges.length > 0;
}

export function getChallenge(project: Project, id: string): ChallengeCard {
  const c = project.challenges.find((c) => c.id === id);
  if (!c) throw new Error(`Challenge "${id}" not found in project "${project.id}"`);
  return c;
}

/**
 * The image to show wherever the "finished" project appears (customize
 * preview, completion screen, collection thumbnail). Returns the chosen
 * paint color's full decorated scene if one exists for it; otherwise falls
 * back to the project's default final-stage art. This lets color-specific
 * scenes be added one at a time — nothing breaks while some are still missing.
 */
export function getFinishedImage(project: Project, progress: ProjectProgress): string {
  const paintId = progress.customization.paint;
  if (paintId) {
    const option = project.customization.find(
      (c) => c.category === "paint" && c.id === paintId
    );
    if (option?.sceneVariant) return option.sceneVariant;
  }
  return project.stages[project.stages.length - 1].image;
}
