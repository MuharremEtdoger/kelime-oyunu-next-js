import { useState } from "react";
import GameScreen from "../components/GameScreen";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <div className="bg-[url('/temple.svg')] bg-repeat bg-center flex justify-center items-center min-h-screen bg-[#fef6f4] text-[#7c1034]"
>
      {!started ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Kelime Bulma Oyunu</h1>
          <button
            onClick={() => setStarted(true)}
            className="bg-[#7c1034] hover:bg-[#7c1034] px-6 py-3 rounded-lg text-lg font-semibold text-[#fef6f4] cursor-pointer
"
          >
            Oyuna Başla
          </button>
        </div>
      ) : (
        <GameScreen />
      )}
    </div>
  );
}
