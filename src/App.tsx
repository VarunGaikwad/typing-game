import { useCallback, useEffect, useState } from "react";
import words from "./data/words.json";

type Difficulty = "easy" | "medium" | "hard" | "punctuation_challenge";

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>(
      (localStorage.getItem("difficulty") as Difficulty) || "easy"
    ),
    [sentence, setSentence] = useState<string>(""),
    [input, setInput] = useState(""),
    [score, setScore] = useState<number>(0),
    [startTime, setStartTime] = useState<number>(0),
    [wpm, setWpm] = useState<number | null>(null),
    onSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (input === sentence) {
        const endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000; // in seconds
        const wordsCount = sentence.split(" ").length;

        // Calculate WPM
        const calculatedWpm = Math.round((wordsCount / timeTaken) * 60);
        setWpm(calculatedWpm);

        // Update score
        setScore((prev) => prev + 10); // Add 10 points for correct submission

        // Reset sentence and input after showing WPM
        setTimeout(() => {
          resetGame();
        }, 3000); // Keep WPM visible for 3 seconds
      } else {
        setScore((prev) => Math.max(0, prev - 5)); // Deduct points for incorrect input
      }
    };

  const resetGame = useCallback(() => {
    const newSentence =
      words[difficulty][Math.floor(Math.random() * words[difficulty].length)];
    setSentence(newSentence);
    setInput("");
    setStartTime(new Date().getTime()); // Record start time
    setWpm(null); // Reset WPM display
  }, [difficulty]);

  useEffect(() => {
    document.querySelector("input")?.focus();
  }, []);

  useEffect(() => {
    resetGame();
    localStorage.setItem("difficulty", difficulty);
  }, [difficulty, resetGame]);

  return (
    <main className="h-screen flex flex-col px-10 py-4 select-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
      <div className="flex gap-4 justify-between mb-6">
        <div className="text-lg font-bold bg-white bg-opacity-20 px-4 py-2 rounded-lg shadow-md">
          Score: {score}
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="border-2 border-white bg-gray-800 text-white p-2 rounded-md outline-none transition-all focus:ring-2 focus:ring-yellow-300"
        >
          <option
            className="bg-gray-800 text-white hover:bg-gray-700"
            value="easy"
          >
            Easy
          </option>
          <option
            className="bg-gray-800 text-white hover:bg-gray-700"
            value="medium"
          >
            Medium
          </option>
          <option
            className="bg-gray-800 text-white hover:bg-gray-700"
            value="hard"
          >
            Hard
          </option>
          <option
            className="bg-gray-800 text-white hover:bg-gray-700"
            value="punctuation_challenge"
          >
            Punctuation Challenge
          </option>
        </select>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 w-full text-center"
        >
          <div className="text-2xl font-semibold tracking-wider">
            {sentence.split("").map((c, i) => (
              <span
                className={`transition-all duration-200 ${
                  input.length > i
                    ? c === input[i]
                      ? "text-green-400 drop-shadow-glow"
                      : "text-red-400"
                    : "opacity-60"
                }`}
                key={i}
              >
                {c}
              </span>
            ))}
          </div>

          <input
            className="outline-none border-2 border-white bg-white bg-opacity-20 text-white p-3 rounded-md w-full mt-6 focus:ring-2 focus:ring-yellow-300 transition-all placeholder-white"
            onChange={(e) => setInput(e.target.value)}
            max={sentence.length}
            value={input}
            type="text"
            placeholder="Type here..."
          />

          {wpm !== null && (
            <div className="text-lg font-semibold text-green-300 mt-4 animate-pulse">
              Words Per Minute: {wpm}
            </div>
          )}
        </form>
      </div>

      <footer className="text-center text-sm text-gray-200 mt-6">
        <p>&copy; 2025 Typing Speed Game. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
