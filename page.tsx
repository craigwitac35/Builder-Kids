"use client";

import { GameProvider } from "@/lib/game";
import { GameScreens } from "@/components/Screens";

export default function Home() {
  return (
    <GameProvider>
      <GameScreens />
    </GameProvider>
  );
}
