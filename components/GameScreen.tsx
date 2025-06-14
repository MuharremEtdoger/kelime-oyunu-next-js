import { useEffect, useState } from "react";
import { getRandomWord, WordItem } from "@/utils/wordUtils";
import Question from "./Question";

const GameScreen = () => {
  const [wordList, setWordList] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [revealedTotal, setRevealedTotal] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(140);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      const lengths = [4, 5, 6, 7, 8, 9, 10];
      const promises = lengths.map(getRandomWord);
      const result = await Promise.all(promises);
      setWordList(result.filter(Boolean) as WordItem[]);
    };
    loadWords();
  }, []);

  useEffect(() => {
    if (gameOver) return; // Oyun bittiyse süre durur

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

const handleQuestionComplete = (
  score: number,
  revealedCount: number,
  guessed: boolean
) => {
  setRevealedTotal(prev => prev + revealedCount);
  if (guessed) {
    setTotalScore(prev => prev + score);
    setCorrectAnswers(prev => prev + 1);
  }

  if (currentIndex + 1 < wordList.length) {
    setTimeout(() => setCurrentIndex(prev => prev + 1), 1000);
  } else {
    setGameOver(true);
  }
};

  if (gameOver) {
    const color =
      totalScore < 2000 ? "red" : totalScore < 4000 ? "yellow" : "green";
  const handleRestart = async () => {
    const lengths = [4, 5, 6, 7, 8, 9, 10];
    const promises = lengths.map(getRandomWord);
    const result = await Promise.all(promises);
    setWordList(result.filter(Boolean) as WordItem[]);

    setCurrentIndex(0);
    setTotalScore(0);
    setCorrectAnswers(0);
    setRevealedTotal(0);
    setTimeLeft(140);
    setGameOver(false);
  };
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-900">
          Oyun Bitti!
        </h1>
        <p className="text-lg mb-3 text-gray-700">Toplam Puan: <span className="font-semibold">{totalScore}</span></p>
        <p className="text-lg mb-3 text-gray-700">Doğru Sayısı: <span className="font-semibold">{correctAnswers} / 7</span></p>
        <p className="text-lg mb-6 text-gray-700">Açılan Harf Sayısı: <span className="font-semibold">{revealedTotal}</span></p>
        <div
          className={`inline-block px-6 py-3 rounded-full font-semibold ${
            color === "red"
              ? "bg-red-500 text-white"
              : color === "yellow"
              ? "bg-yellow-400 text-black"
              : "bg-green-500 text-white"
          }`}
        >
          {color === "red"
            ? "Geliştirmeye Açık!"
            : color === "yellow"
            ? "Fena Değil!"
            : "Harikasın!"}
        </div>
              <button
        onClick={handleRestart}
        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300"
      >
        Tekrar Oyna
      </button>
      </div>
    );
  }

  if (wordList.length === 0)
    return (
      <div className="flex justify-center items-center h-40 text-white text-xl font-medium">
        Yükleniyor...
      </div>
    );

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 backdrop-blur-md rounded-lg shadow-lg text-white bg-[#7c1034]">
      <div className="flex justify-between mb-5 text-sm font-medium tracking-wide">
        <div>
          Süre:{" "}
          <span
            className={`font-bold ${
              timeLeft <= 10 ? "text-red-400 animate-pulse" : ""
            }`}
          >
            {timeLeft} sn
          </span>
        </div>
        <div>
          Soru: <span className="font-semibold">{currentIndex + 1} / 7</span>
        </div>
        <div>
          Toplam Puan: <span className="font-semibold">{totalScore}</span>
        </div>
      </div>

      <Question
        wordItem={wordList[currentIndex]}
        onComplete={handleQuestionComplete}
      />
    </div>
  );
};

export default GameScreen;
