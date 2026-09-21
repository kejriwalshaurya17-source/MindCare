import { API_BASE } from "../api.js";
import { useEffect, useMemo, useState } from "react";

function getGameIcon(game) {
  if (game === "Memory Match") return "🧩";
  if (game === "Sequence Recall") return "🔢";
  if (game === "Reaction Challenge") return "⚡";
  if (game === "Word Recall") return "🔤";

  return "🧠";
}

function getDateKey(date) {
  const d = new Date(date);

  return `${d.getFullYear()}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function getLastSevenDays() {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();

    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    days.push(date);
  }

  return days;
}

function calculateStreak(scores) {
  if (scores.length === 0) {
    return {
      current: 0,
      best: 0,
    };
  }

  const uniqueDates = [
    ...new Set(
      scores.map((item) =>
        getDateKey(item.createdAt)
      )
    ),
  ];

  const dateSet = new Set(uniqueDates);

  let current = 0;
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const todayKey = getDateKey(today);

  if (dateSet.has(todayKey)) {
    current = 1;

    const checkDate = new Date(today);

    while (true) {
      checkDate.setDate(
        checkDate.getDate() - 1
      );

      const key = getDateKey(checkDate);

      if (!dateSet.has(key)) {
        break;
      }

      current++;
    }
  }

  const sortedDates = uniqueDates
    .map((date) => new Date(date))
    .sort((a, b) => a - b);

  let best = sortedDates.length > 0 ? 1 : 0;
  let running = sortedDates.length > 0 ? 1 : 0;

  for (let i = 1; i < sortedDates.length; i++) {
    const difference =
      (sortedDates[i] - sortedDates[i - 1]) /
      (1000 * 60 * 60 * 24);

    if (difference === 1) {
      running++;
      best = Math.max(best, running);
    } else {
      running = 1;
    }
  }

  return {
    current,
    best,
  };
}

function Progress() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchScores() {
      try {
        const response = await fetch(
          `${API_BASE}/api/scores`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch progress data"
          );
        }

        const data = await response.json();

        setScores(data.scores || []);
      } catch (error) {
        console.error(
          "Progress fetch error:",
          error
        );
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

  const gamesCompleted = scores.length;

  const totalTime = scores.reduce(
    (total, item) =>
      total + Number(item.time || 0),
    0
  );

  const totalMinutes = Math.floor(
    totalTime / 60
  );

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, item) =>
              total + Number(item.score || 0),
            0
          ) / scores.length
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(
          ...scores.map((item) =>
            Number(item.score || 0)
          )
        )
      : 0;

  const streak = calculateStreak(scores);

  const lastSevenDays = getLastSevenDays();

  const dailyData = lastSevenDays.map((date) => {
    const dateKey = getDateKey(date);

    const dayScores = scores.filter(
      (item) =>
        getDateKey(item.createdAt) === dateKey
    );

    const average =
      dayScores.length > 0
        ? Math.round(
            dayScores.reduce(
              (total, item) =>
                total +
                Number(item.score || 0),
              0
            ) / dayScores.length
          )
        : 0;

    return {
      date,
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      games: dayScores.length,
      average,
    };
  });

  const maximumDailyScore = Math.max(
    ...dailyData.map((item) => item.average),
    1
  );

  const gameStats = useMemo(() => {
    const grouped = {};

    scores.forEach((item) => {
      if (!grouped[item.game]) {
        grouped[item.game] = [];
      }

      grouped[item.game].push(item);
    });

    return Object.entries(grouped).map(
      ([game, gameScores]) => {
        const average = Math.round(
          gameScores.reduce(
            (total, item) =>
              total + Number(item.score || 0),
            0
          ) / gameScores.length
        );

        const best = Math.max(
          ...gameScores.map((item) =>
            Number(item.score || 0)
          )
        );

        const relativePerformance =
          best > 0
            ? Math.round(
                (average / best) * 100
              )
            : 0;

        return {
          game,
          count: gameScores.length,
          average,
          best,
          relativePerformance,
        };
      }
    );
  }, [scores]);

  const memoryGames =
    scores.filter(
      (item) =>
        item.game === "Memory Match" ||
        item.game === "Sequence Recall" ||
        item.game === "Word Recall"
    ).length;

  const attentionGames =
    scores.filter(
      (item) =>
        item.game === "Reaction Challenge"
    ).length;

  const achievements = [
    {
      icon: "🎮",
      title: "First Game",
      description:
        "Completed your first cognitive activity.",
      unlocked: gamesCompleted >= 1,
    },
    {
      icon: "🧠",
      title: "Memory Explorer",
      description:
        "Complete 5 memory-focused activities.",
      unlocked: memoryGames >= 5,
    },
    {
      icon: "🎯",
      title: "Focus Builder",
      description:
        "Complete 5 attention activities.",
      unlocked: attentionGames >= 5,
    },
    {
      icon: "🔥",
      title: "7 Day Streak",
      description:
        "Train on 7 consecutive days.",
      unlocked: streak.best >= 7,
    },
    {
      icon: "🏆",
      title: "10 Games",
      description:
        "Complete 10 cognitive activities.",
      unlocked: gamesCompleted >= 10,
    },
    {
      icon: "🚀",
      title: "25 Games",
      description:
        "Complete 25 cognitive activities.",
      unlocked: gamesCompleted >= 25,
    },
  ];

  return (
    <div className="page">

      <p className="small-title">
        PROGRESS & ANALYTICS
      </p>

      <div className="progress-header">

        <div>
          <h1>
            Track your cognitive journey.
          </h1>

          <p className="description">
            Review your actual activity, scores and
            training progress over time.
          </p>
        </div>

        <div className="progress-period">
          Last 7 Days
        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="progress-stats">

        <div className="progress-stat-card">

          <span className="progress-stat-icon">
            🧠
          </span>

          <div>
            <span>Average Game Score</span>

            <strong>
              {loading ? "..." : averageScore}
            </strong>

            <small>
              Best: {loading ? "..." : bestScore}
            </small>
          </div>

        </div>

        <div className="progress-stat-card">

          <span className="progress-stat-icon green">
            🎯
          </span>

          <div>
            <span>Games Completed</span>

            <strong>
              {loading ? "..." : gamesCompleted}
            </strong>

            <small>
              Across {gameStats.length} game types
            </small>
          </div>

        </div>

        <div className="progress-stat-card">

          <span className="progress-stat-icon peach">
            ⏱️
          </span>

          <div>
            <span>Training Time</span>

            <strong>
              {loading
                ? "..."
                : `${totalMinutes} min`}
            </strong>

            <small>
              Recorded game time
            </small>
          </div>

        </div>

        <div className="progress-stat-card">

          <span className="progress-stat-icon lavender">
            🔥
          </span>

          <div>
            <span>Current Streak</span>

            <strong>
              {loading
                ? "..."
                : `${streak.current} days`}
            </strong>

            <small>
              Personal best: {streak.best} days
            </small>
          </div>

        </div>

      </div>

      {/* MAIN ANALYTICS */}

      <div className="progress-main">

        <div className="progress-chart-card">

          <div className="progress-card-header">

            <div>
              <span className="card-label">
                DAILY ACTIVITY
              </span>

              <h2>
                Last 7 Days
              </h2>
            </div>

            <strong className="chart-score">
              {gamesCompleted}
            </strong>

          </div>

          {scores.length === 0 ? (

            <div className="progress-empty">
              <span>📊</span>

              <h3>
                No activity yet
              </h3>

              <p>
                Complete a cognitive game to start
                building your progress history.
              </p>
            </div>

          ) : (

            <div className="real-chart">

              {dailyData.map((item) => {

                const height =
                  item.average > 0
                    ? Math.max(
                        12,
                        Math.round(
                          (item.average /
                            maximumDailyScore) *
                            100
                        )
                      )
                    : 4;

                return (
                  <div
                    className="real-chart-column"
                    key={getDateKey(item.date)}
                  >

                    <div className="real-chart-value">
                      {item.average || ""}
                    </div>

                    <div className="real-chart-bar-area">

                      <div
                        className="real-chart-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>

                    </div>

                    <span>
                      {item.label}
                    </span>

                  </div>
                );
              })}

            </div>

          )}

          {scores.length > 0 && (
            <p className="chart-note">
              Daily values show the average score from
              games completed on each day.
            </p>
          )}

        </div>

        {/* GAME PERFORMANCE */}

        <div className="game-performance-card">

          <span className="card-label">
            GAME PERFORMANCE
          </span>

          <h2>
            Activity Breakdown
          </h2>

          {gameStats.length === 0 ? (

            <div className="progress-empty small">
              <span>🧠</span>

              <p>
                Game performance will appear after
                you complete an activity.
              </p>
            </div>

          ) : (

            gameStats.map((item) => (

              <div
                className="performance-item"
                key={item.game}
              >

                <div>
                  <span>
                    {getGameIcon(item.game)}{" "}
                    {item.game}
                  </span>

                  <strong>
                    {item.average}
                  </strong>
                </div>

                <div className="performance-bar">

                  <div
                    className="performance-fill"
                    style={{
                      width: `${item.relativePerformance}%`,
                    }}
                  ></div>

                </div>

                <small className="performance-meta">
                  {item.count}{" "}
                  {item.count === 1
                    ? "game"
                    : "games"}{" "}
                  · Best score {item.best}
                </small>

              </div>

            ))

          )}

        </div>

      </div>

      {/* ACHIEVEMENTS */}

      <section className="achievements-section">

        <div>
          <span className="card-label">
            ACHIEVEMENTS
          </span>

          <h2>
            Your Milestones
          </h2>
        </div>

        <div className="achievement-grid">

          {achievements.map((achievement) => (

            <div
              className={
                achievement.unlocked
                  ? "achievement-card unlocked"
                  : "achievement-card locked"
              }
              key={achievement.title}
            >

              <span>
                {achievement.icon}
              </span>

              <div>
                <h3>
                  {achievement.title}
                </h3>

                <p>
                  {achievement.description}
                </p>
              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Progress;