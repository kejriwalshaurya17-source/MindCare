import { API_BASE } from "../api.js";
import { useEffect, useState } from "react";

const cardValues = [
  "🧠",
  "🎯",
  "🌟",
  "🍀",
  "🚀",
  "🎨",
  "🎵",
  "⚡",
  "🧠",
  "🎯",
  "🌟",
  "🍀",
  "🚀",
  "🎨",
  "🎵",
  "⚡",
];

function shuffleCards() {
  return [...cardValues]
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      matched: false,
    }));
}

function MemoryMatch() {
  const [cards, setCards] = useState(shuffleCards);
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selected.length !== 2) return;

    const first = cards[selected[0]];
    const second = cards[selected[1]];

    setMoves((prev) => prev + 1);

    if (first.value === second.value) {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            selected.includes(card.id)
              ? { ...card, matched: true }
              : card
          )
        );

        setSelected([]);
      }, 400);
    } else {
      setTimeout(() => {
        setSelected([]);
      }, 900);
    }
  }, [selected]);

  async function saveScore(finalMoves, finalTime) {
    const token = localStorage.getItem("token");

    if (!token || scoreSaved) return;

    const score = Math.max(
      200 - finalMoves * 7 - finalTime * 2,
      10
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
            game: "Memory Match",
            score,
            time: finalTime,
            difficulty: "Hard",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Score save failed");
      }

      setScoreSaved(true);

      console.log("Memory Match score saved ✅");
    } catch (error) {
      console.error("Score save error:", error);
    }
  }

  function handleCardClick(index) {
    if (selected.length === 2) return;
    if (selected.includes(index)) return;
    if (cards[index].matched) return;

    setSelected((prev) => [...prev, index]);
  }

  function restartGame() {
    setCards(shuffleCards());
    setSelected([]);
    setMoves(0);
    setTime(0);
    setScoreSaved(false);
  }

  const completed = cards.every((card) => card.matched);

  useEffect(() => {
    if (completed && !scoreSaved) {
      saveScore(moves, time);
    }
  }, [completed]);

  return (
    <div className="game-page">

      <div className="game-header">

        <div>
          <p className="small-title">
            MEMORY GAME · HARD
          </p>

          <h1>Memory Match</h1>

          <p className="description">
            Match all pairs. This challenge uses more cards
            and a longer memory window.
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
          <span>Difficulty</span>
          <strong>Hard</strong>
        </div>

        <div>
          <span>Moves</span>
          <strong>{moves}</strong>
        </div>

        <div>
          <span>Time</span>
          <strong>{time}s</strong>
        </div>

        <div>
          <span>Pairs</span>
          <strong>
            {cards.filter((card) => card.matched).length / 2}/8
          </strong>
        </div>

      </div>


      {completed ? (

        <div className="game-complete">

          <div className="complete-icon">
            🎉
          </div>

          <h2>
            Excellent work!
          </h2>

          <p>
            You completed the Hard Memory Match challenge
            in <strong>{moves}</strong> moves and{" "}
            <strong>{time}</strong> seconds.
          </p>

          <p>
            Your score has been saved to your MindCare
            progress.
          </p>

          <button
            className="primary-btn"
            onClick={restartGame}
          >
            Play Again
          </button>

        </div>

      ) : (

        <div
          className="memory-board"
          style={{
            gridTemplateColumns:
              "repeat(4, 1fr)",
          }}
        >

          {cards.map((card, index) => {

            const isOpen =
              selected.includes(index) ||
              card.matched;

            return (

              <button
                key={card.id}
                className={`memory-card ${
                  isOpen ? "open" : ""
                } ${
                  card.matched ? "matched" : ""
                }`}
                onClick={() =>
                  handleCardClick(index)
                }
              >

                {isOpen ? card.value : "?"}

              </button>

            );
          })}

        </div>

      )}

    </div>
  );
}

export default MemoryMatch;