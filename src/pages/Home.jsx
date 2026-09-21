import { API_BASE } from "../api.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "Friend";
  const token = localStorage.getItem("token");

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch(`${API_BASE}/api/scores`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }

        const data = await response.json();
        setScores(data.scores || []);
      } catch (error) {
        console.error("Score fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchScores();
    } else {
      setLoading(false);
    }
  }, [token]);

  const gamesPlayed = scores.length;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores.map((item) => item.score))
      : 0;

  const totalTime = scores.reduce(
    (total, item) => total + (item.time || 0),
    0
  );

  const totalMinutes = Math.floor(totalTime / 60);

  const completedToday = scores.filter((item) => {
    const today = new Date().toDateString();
    return new Date(item.createdAt).toDateString() === today;
  }).length;

  const todayActivity =
    gamesPlayed > 0
      ? Math.min(Math.round((completedToday / 3) * 100), 100)
      : 0;

  const bestGame =
    scores.length > 0
      ? scores.reduce((best, current) =>
          current.score > best.score ? current : best
        )
      : null;

  const gameNames = new Set(scores.map((item) => item.game));

  const achievements = Math.min(
    gameNames.size + Math.floor(gamesPlayed / 5),
    8
  );

  const cognitiveScore = bestScore;

  let aiTitle = "Start your first cognitive game.";
  let aiText =
    "Complete a cognitive activity so MindCare can build your personalized progress.";

  if (scores.length > 0) {
    if (bestGame?.game === "Memory Match") {
      aiTitle = "Your memory training is underway.";
      aiText =
        "You have completed Memory Match. Keep practicing regularly to build your activity history.";
    } else if (bestGame?.game === "Sequence Recall") {
      aiTitle = "Your recall training is underway.";
      aiText =
        "You have been working on recall. Try another sequence challenge and continue building your progress.";
    } else if (bestGame?.game === "Reaction Challenge") {
      aiTitle = "Your attention training is underway.";
      aiText =
        "You have completed a reaction activity. Keep practicing to build a consistent training routine.";
    } else {
      aiTitle = "Great job keeping your mind active.";
      aiText =
        "Continue playing different cognitive games to build a broader activity history.";
    }
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <p className="small-title">MINDCARE AI</p>

          <h1>Good morning, {userName} 👋</h1>

          <p className="dashboard-subtitle">
            Your personalized cognitive wellness space.
          </p>
        </div>

        <div className="daily-badge">
          <span>🔥</span>

          <div>
            <strong>{gamesPlayed > 0 ? "Active Learner" : "Start Today"}</strong>
            <small>
              {gamesPlayed > 0
                ? `${gamesPlayed} game${gamesPlayed > 1 ? "s" : ""} completed`
                : "Play your first game"}
            </small>
          </div>
        </div>

      </div>


      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <div className="stat-icon purple">🧠</div>

          <div>
            <span>Best Score</span>
            <strong>
              {loading ? "..." : `${bestScore}`}
            </strong>
          </div>
        </div>


        <div className="dashboard-stat">
          <div className="stat-icon green">🎯</div>

          <div>
            <span>Today's Activity</span>
            <strong>
              {loading ? "..." : `${todayActivity}%`}
            </strong>
          </div>
        </div>


        <div className="dashboard-stat">
          <div className="stat-icon peach">⏱️</div>

          <div>
            <span>Training Time</span>
            <strong>
              {loading ? "..." : `${totalMinutes} min`}
            </strong>
          </div>
        </div>


        <div className="dashboard-stat">
          <div className="stat-icon lavender">🏆</div>

          <div>
            <span>Games Played</span>
            <strong>
              {loading ? "..." : gamesPlayed}
            </strong>
          </div>
        </div>

      </div>


      <div className="dashboard-main">

        <div className="training-card">

          <div className="card-heading">

            <div>
              <span className="card-label">
                YOUR PROGRESS
              </span>

              <h2>Daily Mind Training</h2>
            </div>

            <span className="completion">
              {completedToday} / 3
            </span>

          </div>


          <p className="card-description">
            Complete cognitive activities to build your
            MindCare activity history.
          </p>


          <div className="training-progress">
            <div
              className="training-progress-fill"
              style={{
                width: `${Math.min((completedToday / 3) * 100, 100)}%`,
              }}
            ></div>
          </div>


          <div className="training-list">

            <div className="training-item">

              <div className="training-icon">
                🧩
              </div>

              <div className="training-info">
                <strong>Memory Match</strong>
                <span>
                  Visual memory · 5 min
                </span>
              </div>

              <Link
                to="/games/memory-match"
                className="start-small"
              >
                Start
              </Link>

            </div>


            <div className="training-item">

              <div className="training-icon green-bg">
                🔢
              </div>

              <div className="training-info">
                <strong>Sequence Recall</strong>
                <span>
                  Recall · 5 min
                </span>
              </div>

              <Link
                to="/games/sequence-recall"
                className="start-small"
              >
                Start
              </Link>

            </div>


            <div className="training-item">

              <div className="training-icon peach-bg">
                ⚡
              </div>

              <div className="training-info">
                <strong>Reaction Challenge</strong>
                <span>
                  Attention · 3 min
                </span>
              </div>

              <Link
                to="/games/reaction-challenge"
                className="start-small"
              >
                Start
              </Link>

            </div>

          </div>

        </div>


        <div className="insight-card">

          <div className="insight-icon">
            ✨
          </div>

          <span className="card-label">
            AI INSIGHT
          </span>

          <h2>
            {aiTitle}
          </h2>

          <p>
            {aiText}
          </p>

          <Link
            to={
              bestGame?.game === "Memory Match"
                ? "/games/memory-match"
                : "/games/sequence-recall"
            }
            className="primary-btn"
          >
            Start Recommended Exercise →
          </Link>

        </div>

      </div>


      <section className="quick-section">

        <div className="section-title-row">

          <div>
            <span className="card-label">
              QUICK ACCESS
            </span>

            <h2>
              What would you like to do?
            </h2>
          </div>

        </div>


        <div className="quick-grid">

          <Link
            to="/games"
            className="quick-card"
          >
            <span>🎮</span>

            <h3>Play Games</h3>

            <p>
              Train memory and attention.
            </p>
          </Link>


          <Link
            to="/memory"
            className="quick-card"
          >
            <span>🧠</span>

            <h3>Memory Vault</h3>

            <p>
              Review your important memories.
            </p>
          </Link>


          <Link
            to="/progress"
            className="quick-card"
          >
            <span>📊</span>

            <h3>View Progress</h3>

            <p>
              See your cognitive activity.
            </p>
          </Link>


          <Link
            to="/reminders"
            className="quick-card"
          >
            <span>⏰</span>

            <h3>Reminders</h3>

            <p>
              Manage your smart reminders.
            </p>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;