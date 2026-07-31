"use client";

import { useGame } from "@/lib/game";
import { getChallenge, getFinishedImage, getProject, isPlayable, projects } from "@/data/registry";
import { initialProjectProgress, type Project } from "@/data/types";
import { useEffect } from "react";
import { GameImage } from "./GameImage";
import { SelectChallenge } from "./SelectChallenge";
import { GatherBoardsMiniGame } from "./GatherBoardsMiniGame";

/* ---------------------------------- */
/* Router                             */
/* ---------------------------------- */

export function GameScreens() {
  const { state } = useGame();
  const s = state.screen;
  switch (s.name) {
    case "title":
      return <TitleScreen />;
    case "job-intro":
      return <JobIntroScreen projectId={s.projectId} />;
    case "gameplay":
      return <GameplayScreen projectId={s.projectId} />;
    case "customize":
      return <CustomizeScreen projectId={s.projectId} />;
    case "complete":
      return <CompleteScreen projectId={s.projectId} />;
    case "collection":
      return <CollectionScreen />;
  }
}

function useProject(projectId: string): Project {
  const p = getProject(projectId);
  if (!p) throw new Error(`Unknown project: ${projectId}`);
  return p;
}

/* ---------------------------------- */
/* 1. Title                           */
/* ---------------------------------- */

function TitleScreen() {
  const { dispatch, state } = useGame();
  const firstPlayable = projects.find(isPlayable);
  return (
    <div className="screen title-screen">
      <GameImage
        src="ui/builder-kids-game-logo.png"
        label="Builder Kids"
        tone="sun"
        className="title-logo"
      />
      <h1 className="title-tagline">Build · Learn · Create</h1>
      <div className="title-buttons">
        <button
          className="btn-big btn-play"
          onClick={() =>
            firstPlayable &&
            dispatch({ type: "go", screen: { name: "job-intro", projectId: firstPlayable.id } })
          }
        >
          Play
        </button>
        <button
          className="btn-big btn-secondary"
          onClick={() => dispatch({ type: "go", screen: { name: "collection" } })}
        >
          My Builds
        </button>
      </div>
      <button
        className="btn-round sound-toggle"
        onClick={() => dispatch({ type: "toggle-sound" })}
        aria-label="Sound"
      >
        {state.player.settings.soundOn ? "🔊" : "🔇"}
      </button>
    </div>
  );
}

/* ---------------------------------- */
/* 2. Job Intro                       */
/* ---------------------------------- */

function JobIntroScreen({ projectId }: { projectId: string }) {
  const { dispatch } = useGame();
  const project = useProject(projectId);
  return (
    <div className="screen intro-screen">
      <GameImage
        src={project.introImage}
        label={`${project.name} — intro scene`}
        tone="grass"
        className="intro-scene"
      />
      <div className="intro-panel">
        <GameImage
          src="characters/helper-pointing.png"
          label="Helper"
          tone="sun"
          className="intro-helper"
        />
        <p className="intro-text">{project.introText}</p>
      </div>
      <button
        className="btn-big btn-play"
        onClick={() => dispatch({ type: "start-project", projectId })}
      >
        Start Building
      </button>
    </div>
  );
}

/* ---------------------------------- */
/* 3. Gameplay                        */
/* ---------------------------------- */

function GameplayScreen({ projectId }: { projectId: string }) {
  const { state, dispatch } = useGame();
  const project = useProject(projectId);
  const progress = state.player.projects[projectId] ?? initialProjectProgress();
  const step = project.steps[progress.stepIndex];

  useEffect(() => {
    if (!step) dispatch({ type: "go", screen: { name: "customize", projectId } });
  }, [step, dispatch, projectId]);

  if (!step) return null;

  const challengeId = step.challengeIds[progress.challengeIndex];
  const challenge = getChallenge(project, challengeId);
  const stage = project.stages[Math.min(progress.stage, project.stages.length - 1)];

  return (
    <div className="screen gameplay-screen">
      {/* Top bar */}
      <header className="topbar">
        <div className="topbar-job">
          <strong>{project.name}</strong>
          <span>
            Step {progress.stepIndex + 1} of {project.steps.length}: {step.title}
          </span>
        </div>
        <div className="topbar-progress" aria-label="Project progress">
          {project.steps.map((s, i) => (
            <span
              key={s.id}
              className={[
                "step-dot",
                i < progress.stepIndex ? "done" : "",
                i === progress.stepIndex ? "current" : "",
              ].join(" ")}
              title={s.title}
            >
              {i < progress.stepIndex ? "✓" : i + 1}
            </span>
          ))}
        </div>
        <div className="topbar-hud">
          <span className="hud-chip">
            <GameImage src="ui/icon-coin.png" label="Coins" tone="sun" className="hud-icon" />
            {state.player.coins}
          </span>
          <button
            className="btn-round"
            onClick={() => dispatch({ type: "toggle-sound" })}
            aria-label="Sound"
          >
            {state.player.settings.soundOn ? "🔊" : "🔇"}
          </button>
        </div>
      </header>

      {step.id === "gather" ? (
        <GatherBoardsMiniGame
          sceneImage={stage.image}
          rewardCoins={step.rewardCoins}
          onComplete={() => dispatch({ type: "step-completed", projectId })}
        />
      ) : (
        <>
          <main className="scene-wrap">
            <GameImage
              src={stage.image}
              label={`${project.name} — ${stage.label}`}
              tone="grass"
              className="scene-img"
            />
          </main>

          <footer className="challenge-wrap">
            <SelectChallenge
              key={challenge.id}
              challenge={challenge as never}
              onSolved={(helpUsed) =>
                dispatch({ type: "challenge-solved", projectId, challengeId: challenge.id, helpUsed })
              }
            />
          </footer>
        </>
      )}
    </div>
  );
}

/* ---------------------------------- */
/* 4. Customization                   */
/* ---------------------------------- */

function CustomizeScreen({ projectId }: { projectId: string }) {
  const { state, dispatch } = useGame();
  const project = useProject(projectId);
  const progress = state.player.projects[projectId] ?? initialProjectProgress();
  const paints = project.customization.filter((c) => c.category === "paint");
  const decos = project.customization.filter((c) => c.category === "decoration");

  return (
    <div className="screen customize-screen">
      <h2 className="screen-heading">Make it yours!</h2>
      <GameImage
        src={getFinishedImage(project, progress)}
        label={`${project.name} — preview`}
        tone="grass"
        className="customize-preview"
      />
      <div className="customize-groups">
        <div className="customize-group">
          <h3>Pick a paint color</h3>
          <div className="swatch-row">
            {paints.map((p) => (
              <button
                key={p.id}
                className={`swatch ${progress.customization.paint === p.id ? "selected" : ""}`}
                style={{ background: p.color }}
                onClick={() =>
                  dispatch({ type: "choose-customization", projectId, category: "paint", optionId: p.id })
                }
                aria-label={p.label}
              >
                {progress.customization.paint === p.id ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>
        <div className="customize-group">
          <h3>Pick a decoration</h3>
          <div className="swatch-row">
            {decos.map((d) => (
              <button
                key={d.id}
                className={`deco-btn ${progress.customization.decoration === d.id ? "selected" : ""}`}
                onClick={() =>
                  dispatch({
                    type: "choose-customization",
                    projectId,
                    category: "decoration",
                    optionId: d.id,
                  })
                }
              >
                <GameImage src={d.image} label={d.label} tone="sky" className="deco-img" />
                <span>{d.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <button className="btn-big btn-play" onClick={() => dispatch({ type: "finish-project", projectId })}>
        Finish!
      </button>
    </div>
  );
}

/* ---------------------------------- */
/* 5. Completion                      */
/* ---------------------------------- */

function CompleteScreen({ projectId }: { projectId: string }) {
  const { state, dispatch } = useGame();
  const project = useProject(projectId);
  const progress = state.player.projects[projectId] ?? initialProjectProgress();
  const nextProject = projects.find((p) => p.id !== projectId);

  return (
    <div className="screen complete-screen">
      <div className="burst-wrap">
        <GameImage src="effects/effect-reward-burst.png" label="🎉" tone="sun" className="burst" />
      </div>
      <h2 className="screen-heading">You did it!</h2>
      <GameImage
        src={getFinishedImage(project, progress)}
        label={`${project.name} — finished`}
        tone="grass"
        className="complete-scene"
      />
      <p className="complete-text">{project.completionText}</p>
      <div className="complete-rewards">
        <span className="hud-chip">⭐ {"★".repeat(progress.stars)}{"☆".repeat(3 - progress.stars)}</span>
        <span className="hud-chip">
          <GameImage src="ui/icon-coin.png" label="Coins" tone="sun" className="hud-icon" />
          {state.player.coins} coins
        </span>
        <span className="hud-chip">🏅 {project.badgeLabel}</span>
      </div>
      {nextProject && (
        <p className="next-preview">
          Next job: <strong>{nextProject.name}</strong>
          {!isPlayable(nextProject) && " (coming soon!)"}
        </p>
      )}
      <div className="title-buttons">
        <button className="btn-big btn-play" onClick={() => dispatch({ type: "go", screen: { name: "collection" } })}>
          See My Builds
        </button>
        <button className="btn-big btn-secondary" onClick={() => dispatch({ type: "go", screen: { name: "title" } })}>
          Home
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* 6. Collection                      */
/* ---------------------------------- */

function CollectionScreen() {
  const { state, dispatch } = useGame();
  return (
    <div className="screen collection-screen">
      <h2 className="screen-heading">My Builds</h2>
      <div className="collection-grid">
        {projects.map((p) => {
          const prog = state.player.projects[p.id];
          const done = prog?.completed;
          return (
            <div key={p.id} className={`collection-card ${done ? "done" : "locked"}`}>
              {done ? (
                <>
                  <GameImage
                    src={getFinishedImage(p, prog!)}
                    label={p.name}
                    tone="grass"
                    className="collection-thumb"
                  />
                  <span className="collection-name">{p.name}</span>
                  <span className="collection-stars">
                    {"★".repeat(prog.stars)}
                    {"☆".repeat(3 - prog.stars)}
                  </span>
                </>
              ) : (
                <>
                  <GameImage
                    src="collection/collection-locked-slot.png"
                    label="???"
                    tone="steel"
                    className="collection-thumb"
                  />
                  <span className="collection-name">{isPlayable(p) ? p.name : "Coming soon"}</span>
                </>
              )}
            </div>
          );
        })}
        {/* Future-project mystery slots */}
        {[1, 2].map((i) => (
          <div key={`mystery-${i}`} className="collection-card locked">
            <GameImage
              src="collection/collection-locked-slot.png"
              label="???"
              tone="steel"
              className="collection-thumb"
            />
            <span className="collection-name">???</span>
          </div>
        ))}
      </div>
      <button className="btn-big btn-secondary" onClick={() => dispatch({ type: "go", screen: { name: "title" } })}>
        Home
      </button>
    </div>
  );
}
