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
    <main className="h-screen bg-slate-800 text-white flex flex-col px-10 py-4 select-none">
      <div className="flex gap-4 justify-between">
        <div className="text-lg font-bold">Score: {score}</div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          className="border-2 border-slate-500 p-2 rounded-md text-black outline-none"
        >
          <option value="easy" key={"easy"}>
            Easy
          </option>
          <option value="medium" key={"medium"}>
            Medium
          </option>
          <option value="hard" key={"hard"}>
            Hard
          </option>
          <option value="punctuation_challenge" key={"punctuation_challenge"}>
            Punctuation Challenge
          </option>
        </select>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 w-full text-center"
        >
          <div className="text-2xl font-semibold">
            {sentence.split("").map((c, i) => (
              <span
                className={`${
                  input.length > i
                    ? c === input[i]
                      ? "text-green-500"
                      : "text-red-500"
                    : "opacity-50"
                }`}
                key={i}
              >
                {c}
              </span>
            ))}
          </div>
          <input
            className="outline-none border-2 border-slate-500 p-2 rounded-md text-black w-full"
            onChange={(e) => setInput(e.target.value)}
            max={sentence.length}
            value={input}
            type="text"
          />
          {wpm !== null && (
            <div className="text-lg font-semibold text-green-500">
              Words Per Minute: {wpm}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
