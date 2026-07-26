"use client";

import { useEffect, useState } from "react";
import type { SelectChallenge as SelectChallengeCard } from "@/data/types";
import { GameImage } from "./GameImage";

/**
 * The "select" challenge engine (covers math problems AND find-the-object —
 * same interaction: prompt + tap one big option).
 *
 * Wrong-answer ladder (per the approved spec — never harsh, never blocking):
 *   1st wrong → option shakes, gentle hint appears
 *   2nd wrong → one wrong option is removed, stronger hint
 *   3rd wrong → full walkthrough, correct answer glows, child taps to continue
 *
 * Help tracking for stars: 0 = no help, 1 = hint used, 2 = walkthrough used.
 */
export function SelectChallenge({
  challenge,
  onSolved,
}: {
  challenge: SelectChallengeCard;
  onSolved: (helpUsed: 0 | 1 | 2) => void;
}) {
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [removedId, setRemovedId] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<-1 | 0 | 1 | 2>(-1);
  const [shakingId, setShakingId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  // Reset per challenge.
  useEffect(() => {
    setWrongAttempts(0);
    setRemovedId(null);
    setHintLevel(-1);
    setShakingId(null);
    setSolved(false);
  }, [challenge.id]);

  const helpUsed: 0 | 1 | 2 = hintLevel === -1 ? 0 : hintLevel === 2 ? 2 : 1;
  const walkthrough = hintLevel === 2;

  function tapOption(id: string) {
    if (solved) return;
    if (id === challenge.correctOptionId) {
      setSolved(true);
      // Brief beat so the child sees the success state before the scene changes.
      window.setTimeout(() => onSolved(helpUsed), 700);
      return;
    }
    // Wrong answer — climb the ladder, never punish.
    const attempt = wrongAttempts + 1;
    setWrongAttempts(attempt);
    setShakingId(id);
    window.setTimeout(() => setShakingId(null), 450);

    if (attempt === 1) {
      setHintLevel((h) => (h < 0 ? 0 : h));
    } else if (attempt === 2) {
      const firstWrong = challenge.options.find(
        (o) => o.id !== challenge.correctOptionId && o.id !== removedId
      );
      if (firstWrong) setRemovedId(firstWrong.id);
      setHintLevel((h) => (h < 1 ? 1 : h));
    } else {
      setHintLevel(2);
    }
  }

  function tapHelp() {
    if (solved) return;
    setHintLevel((h) => (h >= 2 ? 2 : ((h + 1) as 0 | 1 | 2)));
  }

  const visibleOptions = challenge.options.filter((o) => o.id !== removedId);

  return (
    <div className="challenge">
      <div className="challenge-prompt-row">
        <GameImage
          src="characters/helper-thinking.png"
          label="Helper"
          tone="sun"
          className="challenge-helper"
        />
        <p className="challenge-prompt">{challenge.prompt}</p>
        <button className="btn-round" onClick={tapHelp} aria-label="Help">
          ?
        </button>
      </div>

      {hintLevel >= 0 && (
        <p className={`challenge-hint ${walkthrough ? "walkthrough" : ""}`}>
          {challenge.hints[hintLevel as 0 | 1 | 2]}
        </p>
      )}

      <div className="challenge-options">
        {visibleOptions.map((o) => {
          const isCorrect = o.id === challenge.correctOptionId;
          const glow = walkthrough && isCorrect;
          const success = solved && isCorrect;
          return (
            <button
              key={o.id}
              className={[
                "option-btn",
                shakingId === o.id ? "shake" : "",
                glow ? "glow" : "",
                success ? "success" : "",
              ].join(" ")}
              onClick={() => tapOption(o.id)}
            >
              {o.image && (
                <GameImage src={o.image} label={o.label} tone="wood" className="option-img" />
              )}
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
