import { API_BASE } from "../api.js";
import { useEffect, useRef, useState } from "react";

function createSequence(level) {
  const length = Math.min(3 + level, 8);

  return Array.from(
    { length },
    () => Math.floor(Math.random() * 9) + 1
  );
}

function SequenceRecall() {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState(() => createSequence(1));
  const [userSequence, setUserSequence] = useState([]);
  const [showSequence, setShowSequence] = useState(true);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(
    "Remember the sequence..."
  );
  const [gameOver, setGameOver] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0);

  const gameStartTime = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        const seconds = Math.floor(
          (Date.now() - gameStartTime.current) / 1000
        );

        setElapsedTime(seconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    const displayTime = Math.max(
      1800,
      3000 - level * 100
    );

    const timer = setTimeout(() => {
      setShowSequence(false);
      setMessage(
        "Type the sequence using your keyboard."
      );
    }, displayTime);

    return () => clearTimeout(timer);
  }, [level]);

  function addNumber(number) {
    if (showSequence || gameOver) return;

    if (userSequence.length >= sequence.length) return;

    const newSequence = [
      ...userSequence,
      number,
    ];

    setUserSequence(newSequence);
  }

  function removeLastNumber() {
    if (showSequence || gameOver) return;

    setUserSequence((prev) => prev.slice(0, -1));
  }

  function submitSequence() {
    if (showSequence || gameOver) return;

    if (userSequence.length !== sequence.length) {
      setMessage(
        `Enter all ${sequence.length} numbers first.`
      );
      return;
    }

    const correct = userSequence.every(
      (value, index) =>
        value === sequence[index]
    );

    if (correct) {
      const levelScore = level * 15;
      const newScore = score + levelScore;

      setScore(newScore);

      setMessage(
        "Correct! Get ready for the next level."
      );

      setTimeout(() => {
        const nextLevel = level + 1;

        setLevel(nextLevel);
        setSequence(createSequence(nextLevel));
        setUserSequence([]);
        setShowSequence(true);
      }, 1000);
    } else {
      setMessage("Incorrect sequence.");
      setGameOver(true);
    }
  }

  useEffect(() => {
    function handleKeyboard(event) {
      if (showSequence || gameOver) return;

      if (/^[1-9]$/.test(event.key)) {
        addNumber(Number(event.key));
      }

      if (event.key === "Backspace") {
        removeLastNumber();
      }

      if (event.key === "Enter") {
        submitSequence();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, [
    showSequence,
    gameOver,
    userSequence,
    sequence,
  ]);

  async function saveScore() {
    const token = localStorage.getItem("token");

    if (!token || scoreSaved) return;

    const finalTime = Math.max(
      1,
      Math.floor(
        (Date.now() - gameStartTime.current) /
          1000
      )
    );

    try {
      const response = await fetch(
        `${API_BASE}/api/scores`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            game: "Sequence Recall",
            score,
            time: finalTime,
            difficulty: "Adaptive",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Score save failed"
        );
      }

      setScoreSaved(true);

      console.log(
        "Sequence Recall score saved ✅",
        {
          score,
          time: finalTime,
        }
      );
    } catch (error) {
      console.error(
        "Sequence Recall score save error:",
        error
      );
    }
  }

  useEffect(() => {
    if (gameOver) {
      saveScore();
    }
  }, [gameOver]);

  function restartGame() {
    gameStartTime.current = Date.now();

    setLevel(1);
    setSequence(createSequence(1));
    setUserSequence([]);
    setScore(0);
    setElapsedTime(0);
    setMessage("Remember the sequence...");
    setShowSequence(true);
    setGameOver(false);
    setScoreSaved(false);
  }

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            MEMORY GAME · ADAPTIVE
          </p>

          <h1>
            Sequence Recall
          </h1>

          <p className="description">
            Remember the numbers in the correct order,
            then reproduce them using your keyboard.
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
          <strong>{level}</strong>
        </div>

        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>

        <div>
          <span>Sequence</span>
          <strong>{sequence.length}</strong>
        </div>

        <div>
          <span>Time</span>
          <strong>{elapsedTime}s</strong>
        </div>

      </div>

      <div className="sequence-game">

        <div className="sequence-message">

          <span>
            {showSequence ? "👀" : "⌨️"}
          </span>

          <h2>{message}</h2>

        </div>

        <div className="sequence-display">

          {showSequence ? (

            sequence.map((number, index) => (
              <div
                className="sequence-number"
                key={index}
              >
                {number}
              </div>
            ))

          ) : (

            <div className="typed-sequence">

              {userSequence.length > 0
                ? userSequence.map(
                    (number, index) => (
                      <div
                        className="sequence-number"
                        key={index}
                      >
                        {number}
                      </div>
                    )
                  )
                : (
                  <div className="hidden-sequence">
                    Type numbers...
                  </div>
                )}

            </div>

          )}

        </div>

        {!showSequence && !gameOver && (

          <>

            <div className="keyboard-hint">

              <span>⌨️</span>

              Type numbers using your keyboard

              <strong>1–9</strong>

              <span>·</span>

              Press <strong>Enter</strong> to submit

            </div>

            <div className="number-grid">

              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                (number) => (
                  <button
                    key={number}
                    className="number-btn"
                    onClick={() =>
                      addNumber(number)
                    }
                  >
                    {number}
                  </button>
                )
              )}

            </div>

            <div className="sequence-actions">

              <button
                className="secondary-btn"
                onClick={removeLastNumber}
                disabled={
                  userSequence.length === 0
                }
              >
                ← Delete
              </button>

              <button
                className="primary-btn"
                onClick={submitSequence}
                disabled={
                  userSequence.length !==
                  sequence.length
                }
              >
                Submit Sequence ✓
              </button>

            </div>

          </>

        )}

        {gameOver && (

          <div className="game-complete">

            <div className="complete-icon">
              🧠
            </div>

            <h2>
              Good attempt!
            </h2>

            <p>
              You reached level{" "}
              <strong>{level}</strong> with a
              score of{" "}
              <strong>{score}</strong>.
            </p>

            <p>
              Training time:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              Your Sequence Recall score and
              training time have been saved to
              your MindCare progress.
            </p>

            <button
              className="primary-btn"
              onClick={restartGame}
            >
              Try Again
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default SequenceRecall;