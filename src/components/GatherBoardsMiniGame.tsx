"use client";

import { useMemo, useState } from "react";
import { GameImage } from "./GameImage";

const BOARD_SPOTS = [
  { id: "board-a", x: 8, y: 58, rotate: -8 },
  { id: "board-b", x: 28, y: 71, rotate: 5 },
  { id: "board-c", x: 55, y: 61, rotate: -4 },
  { id: "board-d", x: 76, y: 73, rotate: 8 },
  { id: "board-e", x: 18, y: 38, rotate: 12 },
  { id: "board-f", x: 68, y: 39, rotate: -11 },
];

export function GatherBoardsMiniGame({
  sceneImage,
  rewardCoins,
  onComplete,
}: {
  sceneImage: string;
  rewardCoins: number;
  onComplete: () => void;
}) {
  const [collected, setCollected] = useState<string[]>([]);
  const [phase, setPhase] = useState<"collect" | "longest" | "complete">("collect");
  const [message, setMessage] = useState("Find 4 boards and tap them to load the truck!");
  const [wrongBoard, setWrongBoard] = useState<string | null>(null);

  const remaining = useMemo(
    () => BOARD_SPOTS.filter((board) => !collected.includes(board.id)),
    [collected]
  );

  function collectBoard(id: string) {
    if (phase !== "collect" || collected.includes(id)) return;
    const next = [...collected, id];
    setCollected(next);

    if (next.length === 4) {
      setMessage("Great loading! Now tap the longest board for the final spot.");
      window.setTimeout(() => setPhase("longest"), 450);
    } else {
      setMessage(`${next.length} of 4 loaded. Find ${4 - next.length} more!`);
    }
  }

  function chooseLength(id: "short" | "medium" | "long") {
    if (phase !== "longest") return;
    if (id !== "long") {
      setWrongBoard(id);
      setMessage("Almost! Look for the board that stretches the farthest.");
      window.setTimeout(() => setWrongBoard(null), 450);
      return;
    }

    setPhase("complete");
    setMessage(`Materials ready! You earned ${rewardCoins} Builder Coins.`);
  }

  return (
    <section className="gather-game" aria-label="Gather boards mini-game">
      <div className="gather-instructions">
        <GameImage
          src="characters/helper-pointing.png"
          label="Builder helper"
          tone="sun"
          className="gather-helper"
        />
        <div>
          <span className="mini-game-label">Hands-on build</span>
          <h2>{phase === "collect" ? "Load the Truck" : phase === "longest" ? "Choose the Longest" : "Materials Ready!"}</h2>
          <p>{message}</p>
        </div>
      </div>

      <div className="gather-yard">
        <GameImage
          src={sceneImage}
          label="Doghouse materials yard"
          tone="grass"
          className="gather-background"
        />

        {phase === "collect" &&
          remaining.map((board) => (
            <button
              key={board.id}
              className="yard-board"
              style={{ left: `${board.x}%`, top: `${board.y}%`, transform: `rotate(${board.rotate}deg)` }}
              onClick={() => collectBoard(board.id)}
              aria-label="Load this board"
            >
              <GameImage src="props/board-exact.png" label="Wood board" tone="wood" />
            </button>
          ))}

        <div className="truck-bed" aria-label={`${collected.length} of 4 boards loaded`}>
          <div className="truck-cab">🚚</div>
          <div className="truck-load">
            {Array.from({ length: 4 }).map((_, index) => (
              <span key={index} className={index < collected.length ? "loaded" : ""}>
                {index < collected.length ? "▰" : "·"}
              </span>
            ))}
          </div>
          <strong>{Math.min(collected.length, 4)} / 4</strong>
        </div>
      </div>

      {phase === "longest" && (
        <div className="length-picker">
          {([
            ["short", "props/board-short.png", "Short"],
            ["medium", "props/board-exact.png", "Medium"],
            ["long", "props/board-long.png", "Longest"],
          ] as const).map(([id, image, label]) => (
            <button
              key={id}
              className={`length-board ${wrongBoard === id ? "shake" : ""}`}
              onClick={() => chooseLength(id)}
            >
              <GameImage src={image} label={`${label} board`} tone="wood" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {phase === "complete" && (
        <div className="mini-game-complete">
          <div className="coin-burst">🪙 +{rewardCoins}</div>
          <button className="btn-big btn-play" onClick={onComplete}>
            Keep Building
          </button>
        </div>
      )}
    </section>
  );
}
