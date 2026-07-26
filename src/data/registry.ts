import type { ChallengeCard, Project } from "./types";
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
