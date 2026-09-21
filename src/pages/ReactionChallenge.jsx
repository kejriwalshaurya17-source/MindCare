import { API_BASE } from "../api.js";
import { useEffect, useRef, useState } from "react";

function getWaitTime(round) {
  const minimum = Math.max(
    700,
    1800 - round * 80
  );

  const maximum = Math.max(
    1800,
    4000 - round * 100
  );

  return (
    Math.floor(
      Math.random() *
        (maximum - minimum + 1)
    ) + minimum
  );
}

function calculatePoints(time, round) {
  const speedPoints = Math.max(
    10,
    Math.floor(1200 - time * 1.5)
  );

  const roundBonus = round * 10;

  return speedPoints + roundBonus;
}

function ReactionChallenge() {
  const [gameState, setGameState] =
    useState("waiting");

  const [startTime, setStartTime] =
    useState(null);

  const [reactionTime, setReactionTime] =
    useState(null);

  const [bestTime, setBestTime] =
    useState(null);

  const [round, setRound] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [scoreSaved, setScoreSaved] =
    useState(false);

  const gameStartTime = useRef(
    Date.now()
  );

  const totalRounds = 10;

  /* TOTAL GAME TIMER */

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState !== "finished") {
        const seconds = Math.floor(
          (Date.now() -
            gameStartTime.current) /
            1000
        );

        setElapsedTime(seconds);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  /* WAIT FOR SIGNAL */

  useEffect(() => {
    if (gameState !== "waiting") {
      return;
    }

    const delay = getWaitTime(round);

    const timer = setTimeout(() => {
      setStartTime(Date.now());
      setGameState("ready");
    }, delay);

    return () => clearTimeout(timer);
  }, [gameState, round]);

  function startGame() {
    setReactionTime(null);
    setGameState("waiting");
  }

  function handleClick() {
    if (gameState === "waiting") {
      setGameState("too-early");
      return;
    }

    if (gameState !== "ready") {
      return;
    }

    const time =
      Date.now() - startTime;

    setReactionTime(time);

    if (
      bestTime === null ||
      time < bestTime
    ) {
      setBestTime(time);
    }

    const points =
      calculatePoints(
        time,
        round
      );

    setScore(
      (prev) => prev + points
    );

    setGameState("result");
  }

  function nextRound() {
    if (round >= totalRounds) {
      setGameState("finished");
      return;
    }

    setRound(
      (prev) => prev + 1
    );

    setGameState("waiting");

    setReactionTime(null);
  }

  function restartGame() {
    gameStartTime.current =
      Date.now();

    setGameState("waiting");
    setStartTime(null);
    setReactionTime(null);
    setBestTime(null);
    setRound(1);
    setScore(0);
    setElapsedTime(0);
    setScoreSaved(false);
  }

  async function saveScore() {
    const token =
      localStorage.getItem("token");

    if (!token || scoreSaved) {
      return;
    }

    const finalTime = Math.max(
      1,
      Math.floor(
        (Date.now() -
          gameStartTime.current) /
          1000
      )
    );

    try {
      const response =
        await fetch(
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
              game:
                "Reaction Challenge",

              score,

              time: finalTime,

              difficulty:
                "Adaptive",
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
        "Reaction Challenge score saved ✅",
        {
          score,
          trainingTime: finalTime,
          bestReaction: bestTime,
        }
      );
    } catch (error) {
      console.error(
        "Reaction Challenge score save error:",
        error
      );
    }
  }

  useEffect(() => {
    if (
      gameState === "finished"
    ) {
      saveScore();
    }
  }, [gameState]);

  return (
    <div className="game-page">

      <div className="game-header">

        <div>

          <p className="small-title">
            ATTENTION GAME · ADAPTIVE
          </p>

          <h1>
            Reaction Challenge
          </h1>

          <p className="description">
            React as quickly as possible
            when the signal appears. Each
            round becomes more challenging.
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
          <span>Round</span>

          <strong>
            {round}/{totalRounds}
          </strong>
        </div>

        <div>
          <span>Score</span>

          <strong>
            {score}
          </strong>
        </div>

        <div>
          <span>Best Time</span>

          <strong>
            {bestTime !== null
              ? `${bestTime} ms`
              : "--"}
          </strong>
        </div>

        <div>
          <span>Training</span>

          <strong>
            {elapsedTime}s
          </strong>
        </div>

      </div>

      <div className="reaction-game">

        {gameState !== "finished" && (

          <button
            className={`reaction-zone ${gameState}`}
            onClick={handleClick}
          >

            {gameState === "waiting" && (
              <>
                <span className="reaction-icon">
                  👀
                </span>

                <strong>
                  Wait for it...
                </strong>

                <small>
                  Don't click yet
                </small>
              </>
            )}

            {gameState === "ready" && (
              <>
                <span className="reaction-icon">
                  ⚡
                </span>

                <strong>
                  CLICK NOW!
                </strong>

                <small>
                  React as quickly as possible
                </small>
              </>
            )}

            {gameState === "too-early" && (
              <>
                <span className="reaction-icon">
                  ❌
                </span>

                <strong>
                  Too Early!
                </strong>

                <small>
                  Wait for the signal before
                  clicking.
                </small>
              </>
            )}

            {gameState === "result" && (
              <>
                <span className="reaction-icon">
                  🎯
                </span>

                <strong>
                  {reactionTime} ms
                </strong>

                <small>
                  Round complete!
                </small>
              </>
            )}

          </button>

        )}

        {gameState === "result" && (

          <div className="reaction-result">

            <h2>
              {reactionTime} ms
            </h2>

            <div className="reaction-score">
              +
              {calculatePoints(
                reactionTime,
                round
              )}
              {" "}points
            </div>

            <p>
              {reactionTime < 250
                ? "Excellent reaction!"
                : reactionTime < 400
                ? "Great reaction! Keep going."
                : reactionTime < 600
                ? "Good job! Try to react faster."
                : "Keep practicing to improve your speed."}
            </p>

            <button
              className="primary-btn"
              onClick={nextRound}
            >
              {round >= totalRounds
                ? "Finish Challenge →"
                : "Next Round →"}
            </button>

          </div>

        )}

        {gameState === "too-early" && (

          <div className="reaction-result">

            <h2>
              Be patient!
            </h2>

            <p>
              Wait until the signal appears
              and then react as quickly as
              possible.
            </p>

            <button
              className="primary-btn"
              onClick={startGame}
            >
              Try Again
            </button>

          </div>

        )}

        {gameState === "finished" && (

          <div className="game-complete">

            <div className="complete-icon">
              🏆
            </div>

            <h2>
              Challenge Complete!
            </h2>

            <p>
              You completed all{" "}
              <strong>
                {totalRounds}
              </strong>{" "}
              rounds.
            </p>

            <p>
              Final Score:{" "}
              <strong>
                {score}
              </strong>
            </p>

            <p>
              Best Reaction:{" "}
              <strong>
                {bestTime !== null
                  ? `${bestTime} ms`
                  : "--"}
              </strong>
            </p>

            <p>
              Training Time:{" "}
              <strong>
                {elapsedTime} seconds
              </strong>
            </p>

            <p>
              Your Reaction Challenge
              score and training time have
              been saved to your MindCare
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

export default ReactionChallenge;