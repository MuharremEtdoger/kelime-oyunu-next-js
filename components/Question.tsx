import { useEffect, useState } from "react";
import { WordItem } from "@/utils/wordUtils";

interface QuestionProps {
  wordItem: WordItem;
  onComplete: (score: number, revealedCount: number, guessed: boolean) => void;
}

const Question = ({ wordItem, onComplete }: QuestionProps) => {
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [guess, setGuess] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | boolean>(null);

  useEffect(() => {
    setRevealed(Array(wordItem.word.length).fill(false));
    setGuess("");
    setIsAnswered(false);
    setScore(wordItem.word.length * 100);
    setFeedback(null);
  }, [wordItem]);

  const handleReveal = () => {
    if (isAnswered) return;

    const hiddenIndexes = revealed
      .map((val, idx) => (!val ? idx : -1))
      .filter(i => i !== -1);

    if (hiddenIndexes.length === 0) return;

    const randomIndex =
      hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];

    const updatedRevealed = [...revealed];
    updatedRevealed[randomIndex] = true;

    setRevealed(updatedRevealed);
    setScore(prev => Math.max(prev - 100, 0));
  };

  const handleGuess = () => {
    if (isAnswered) return;

    const isCorrect = guess.trim().toLowerCase() === wordItem.word.toLowerCase();
    setIsAnswered(true);
    setFeedback(isCorrect);

    const revealedCount = revealed.filter(Boolean).length;
    onComplete(score, revealedCount, isCorrect);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">{wordItem.definition}</h2>

      <div className="flex justify-center gap-3 mb-6">
        {wordItem.word.split("").map((char, idx) => (
          <span
            key={idx}
            className={`w-12 h-12 border-2 rounded-md flex items-center justify-center text-3xl font-mono select-none
            ${
              revealed[idx] || isAnswered
                ? "border-green-400 text-green-300"
                : "border-white-500 text-white-400"
            }
            `}
          >
            {revealed[idx] || isAnswered ? char.toUpperCase() : "_"}
          </span>
        ))}
      </div>

      {!isAnswered && (
        <div className="flex flex-col items-center gap-5 mb-6">
          <button
            onClick={handleReveal}
            className="bg-[#faab99] hover:bg-[#faab99] active:bg-[#faab99] text-black font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            Harf Aç (-100 puan)
          </button>

          <div className="flex gap-3">
            <input
              type="text"
              className="p-3 rounded-md border border-gray-400 text-white-900 font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52"
              placeholder="Tahmininizi yazın"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              disabled={isAnswered}
              onKeyDown={e => {
                if (e.key === "Enter") handleGuess();
              }}
              autoFocus
            />
            <button
              onClick={handleGuess}
              disabled={guess.trim() === ""}
              className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors duration-200
                ${
                  guess.trim() === ""
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white"
                }
              `}
            >
              Tahmin Et
            </button>
          </div>
        </div>
      )}

      {isAnswered && (
        <div
          className={`text-lg font-semibold ${
            feedback
              ? "text-green-400"
              : "text-red-400"
          } transition-opacity duration-500`}
        >
          {feedback ? "Doğru!" : `Yanlış! Doğru cevap: ${wordItem.word.toUpperCase()}`}
        </div>
      )}

      <p className="mt-6 text-xl font-bold text-gray-100">Puan: {score}</p>
    </div>
  );
};

export default Question;
