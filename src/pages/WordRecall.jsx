import { API_BASE } from "../api.js";
import { useEffect, useRef, useState } from "react";

const wordBank = [
  "Apple",
  "River",
  "Chair",
  "Moon",
  "Tiger",
  "Book",
  "Garden",
  "Cloud",
  "Bottle",
  "Star",
  "Train",
  "Flower",
  "House",
  "Ocean",
  "Camera",
  "Laptop",
  "Coffee",
  "Mountain",
  "Bridge",
  "Pencil",
  "Window",
  "Forest",
  "Guitar",
  "School",
  "Doctor",
  "Rocket",
  "Orange",
  "Mirror",
  "Rabbit",
  "Village",
  "Bicycle",
  "Castle",
  "Beach",
  "Planet",
  "Clock",
  "Umbrella",
  "Football",
  "Candle",
  "Library",
  "Airport",
  "Butterfly",
  "Keyboard",
  "Phone",
  "Tree",
  "Table",
  "Sun",
  "Rainbow",
  "Horse",
  "Pillow",
  "Temple",
  "Bus",
  "Car",
  "Map",
  "Leaf",
  "Drum",
  "Crown",
  "Ship",
  "Pen",
  "Lion",
  "Parrot",
  "Pizza",
  "Notebook",
  "Globe",
];

const uniqueWordBank = [...new Set(wordBank)];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getWordCount(level) {
  return Math.min(
    5 + Math.floor((level - 1) / 2),
    8
  );
}

function getDisplayTime(level, wordCount) {
  const baseTime = 5000 + wordCount * 350;
  const difficultyReduction =
    (level - 1) * 250;

  return Math.max(
    3000,
    baseTime - difficultyReduction
  );
}

function getDifficulty(level) {
  if (level <= 2) return "Easy";
  if (level <= 5) return "Medium";
  return "Hard";
}

function createRound(wordCount, usedWords) {
  const available = uniqueWordBank.filter(
    (word) => !usedWords.includes(word)
  );

  let sourceWords = available;

  if (sourceWords.length < wordCount) {
    sourceWords = uniqueWordBank;
  }

  const newWords = shuffle(sourceWords).slice(
    0,
    wordCount
  );

  const distractorPool = uniqueWordBank.filter(
    (word) => !newWords.includes(word)
  );

  const distractors = shuffle(
    distractorPool
  ).slice(0, wordCount);

  return {
    words: newWords,
    options: shuffle([
      ...newWords,
      ...distractors,
    ]),
  };
}

function WordRecall() {
  const usedWords = useRef([]);

  const gameStartTime = useRef(Date.now());

  const firstRound = createRound(5, []);

  const [words, setWords] = useState(
    firstRound.words
  );

  const [options, setOptions] = useState(
    firstRound.options
  );

  const [selectedWords, setSelectedWords] =
    useState([]);

  const [showWords, setShowWords] =
    useState(true);

  const [level, setLevel] = useState(1);

  const [score, setScore] = useState(0);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [message, setMessage] = useState(
    "Remember these words..."
  );

  const [gameOver, setGameOver] =
    useState(false);

  const [scoreSaved, setScoreSaved] =
    useState(false);

  useEffect(() => {
    usedWords.current = firstRound.words;
  }, []);

  /* GAME TIMER */

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        const seconds = Math.floor(
          (Date.now() -
            gameStartTime.current) /
            1000
        );

        setElapsedTime(seconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  /* WORD DISPLAY TIMER */

  useEffect(() => {
    if (!showWords || gameOver) return;

    const displayTime = getDisplayTime(
      level,
      words.length
    );

    const timer = setTimeout(() => {
      setShowWords(false);

      setMessage(
        "Select only the words you remember."
      );
    }, displayTime);

    return () => clearTimeout(timer);
  }, [
    level,
    words,
    showWords,
    gameOver,
  ]);

  function handleWordClick(word) {
    if (showWords || gameOver) {
      return;
    }

    if (selectedWords.includes(word)) {
      setSelectedWords((prev) =>
        prev.filter(
          (item) => item !== word
        )
      );
    } else {
      setSelectedWords((prev) => [
        ...prev,
        word,
      ]);
    }
  }

  function checkAnswer() {
    if (selectedWords.length === 0) {
      setMessage(
        "Select the words you remember first."
      );
      return;
    }

    const correct =
      selectedWords.length === words.length &&
      selectedWords.every((word) =>
        words.includes(word)
      );

    if (correct) {
      const levelPoints =
        level * 20 + words.length * 5;

      setScore(
        (prev) => prev + levelPoints
      );

      setMessage(
        `Perfect! +${levelPoints} points`
      );

      setTimeout(() => {
        const nextLevel = level + 1;

        if (nextLevel > 8) {
          setGameOver(true);
          return;
        }

        const nextWordCount =
          getWordCount(nextLevel);

        const nextRound = createRound(
          nextWordCount,
          usedWords.current
        );

        usedWords.current = [
          ...usedWords.current,
          ...nextRound.words,
        ];

        setWords(nextRound.words);
        setOptions(nextRound.options);
        setSelectedWords([]);
        setLevel(nextLevel);
        setShowWords(true);

        setMessage(
          "Remember these words..."
        );
      }, 900);
    } else {
      setMessage(
        "Some selected words were incorrect."
      );

      setGameOver(true);
    }
  }

  function restartGame() {
    const newRound = createRound(
      5,
      []
    );

    gameStartTime.current = Date.now();

    usedWords.current =
      newRound.words;

    setWords(newRound.words);
    setOptions(newRound.options);
    setSelectedWords([]);
    setLevel(1);
    setScore(0);
    setElapsedTime(0);
    setShowWords(true);
    setGameOver(false);
    setScoreSaved(false);

    setMessage(
      "Remember these words..."
    );
  }

  async function saveScore() {
    const token =
      localStorage.getItem("token");

    if (!token || scoreSaved) return;

    const finalTime = Math.max(
      1,
      Math.floor(
        (Date.now() -
          gameStartTime.current) /
          1000
      )
    );

    try {
      const response = await fetch(
        `${API_BASE}/api/scores`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            game: "Word Recall",
            score,
            time: finalTime,
            difficulty: "Adaptive",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Word Recall score save failed"
        );
      }

      setScoreSaved(true);

      console.log(
        "Word Recall score saved ✅",
        {
          score,
          time: finalTime,
        }
      );
    } catch (error) {
      console.error(
        "Word Recall score save error:",
        error
      );
    }
  }

  useEffect(() => {
    if (gameOver) {
      saveScore();
    }
  }, [gameOver]);

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            MEMORY GAME · ADAPTIVE
          </p>

          <h1>
            Word Recall
          </h1>

          <p className="description">
            Remember the words before they
            disappear, then identify them
            from the options.
          </p>

        </div>

        <button
          className="secondary-btn"
          onClick={restartGame}
        >
          Restart
        </button>

      </div>

      <div className="game-stats">

        <div>
          <span>Level</span>
          <strong>{level}/8</strong>
        </div>

        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>

        <div>
          <span>Words</span>
          <strong>{words.length}</strong>
        </div>

        <div>
          <span>Time</span>
          <strong>
            {elapsedTime}s
          </strong>
        </div>

      </div>

      <div className="word-game">

        <div className="word-message">

          <span>
            {showWords
              ? "👀"
              : "🧠"}
          </span>

          <h2>
            {message}
          </h2>

        </div>

        {showWords && (

          <div className="word-display">

            {words.map((word) => (
              <div
                className="word-card"
                key={word}
              >
                {word}
              </div>
            ))}

          </div>

        )}

        {!showWords &&
          !gameOver && (

            <>

              <p className="word-instruction">
                Select every word that
                appeared earlier.
              </p>

              <div className="word-options">

                {options.map((word) => (

                  <button
                    key={word}
                    className={
                      selectedWords.includes(
                        word
                      )
                        ? "word-option selected"
                        : "word-option"
                    }
                    onClick={() =>
                      handleWordClick(
                        word
                      )
                    }
                  >
                    {word}
                  </button>

                ))}

              </div>

              <button
                className="primary-btn"
                onClick={checkAnswer}
              >
                Check Answer →
              </button>

            </>

          )}

        {gameOver && (

          <div className="game-complete">

            <div className="complete-icon">
              {level >= 8
                ? "🏆"
                : "🧠"}
            </div>

            <h2>
              {level >= 8
                ? "Challenge Complete!"
                : "Good attempt!"}
            </h2>

            <p>
              You reached level{" "}
              <strong>
                {level}
              </strong>.
            </p>

            <p>
              Final Score:{" "}
              <strong>
                {score}
              </strong>
            </p>

            <p>
              Training Time:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              Difficulty reached:{" "}
              <strong>
                {getDifficulty(level)}
              </strong>
            </p>

            <p>
              Your Word Recall score
              and training time have been
              saved to your MindCare
              progress.
            </p>

            <button
              className="primary-btn"
              onClick={restartGame}
            >
              Play Again
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default WordRecall;