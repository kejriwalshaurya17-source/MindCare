import { API_BASE } from "../api.js";
import { useEffect, useState } from "react";

function Caregiver() {
  const [authorized, setAuthorized] = useState(false);
  const [caregiverEmail, setCaregiverEmail] = useState("");
  const [access, setAccess] = useState(null);

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const userName = user?.name || "User";

  useEffect(() => {
    async function loadCaregiverData() {
      try {
        const accessResponse = await fetch(
          `${API_BASE}/api/caregiver/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const accessData = await accessResponse.json();

        setAuthorized(accessData.authorized);
        setAccess(accessData.access);

        const scoreResponse = await fetch(
          `${API_BASE}/api/scores`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const scoreData = await scoreResponse.json();

        setScores(scoreData.scores || []);
      } catch (error) {
        console.error(
          "Caregiver data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadCaregiverData();
    } else {
      setLoading(false);
    }
  }, [token]);

  async function authorizeCaregiver() {
    if (!caregiverEmail.trim()) {
      alert("Please enter caregiver email.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/caregiver/authorize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            caregiverEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Authorization failed");
        return;
      }

      setAuthorized(true);
      setAccess(data.access);
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend.");
    }
  }

  async function revokeAccess() {
    try {
      const response = await fetch(
        `${API_BASE}/api/caregiver/revoke`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Could not revoke access");
        return;
      }

      setAuthorized(false);
      setAccess(null);
      setCaregiverEmail("");
    } catch (error) {
      console.error(error);
      alert("Could not connect to backend.");
    }
  }

  const gamesCompleted = scores.length;

  const totalTime = scores.reduce(
    (total, item) => total + (item.time || 0),
    0
  );

  const totalMinutes = Math.floor(totalTime / 60);

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, item) => total + item.score,
            0
          ) / scores.length
        )
      : 0;

  const uniqueGameNames = new Set(
    scores.map((item) => item.game)
  );

  const gameTypes = uniqueGameNames.size;

  const activityDates = [
    ...new Set(
      scores.map((item) =>
        new Date(item.createdAt).toDateString()
      )
    ),
  ];

  const currentStreak =
    activityDates.length > 0
      ? Math.min(activityDates.length, 7)
      : 0;

  const recentScores = scores.slice(0, 5);

  if (loading) {
    return (
      <div className="page">
        <div className="caregiver-access">
          <div className="caregiver-icon">
            👥
          </div>

          <h1>Loading caregiver dashboard...</h1>

          <p className="description">
            Fetching authorized activity from MindCare.
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="page">

        <div className="caregiver-access">

          <div className="caregiver-icon">
            🔐
          </div>

          <p className="small-title">
            CAREGIVER ACCESS
          </p>

          <h1>
            Private support dashboard.
          </h1>

          <p className="description">
            Caregiver access is available only after
            the user explicitly authorizes a caregiver.
          </p>

          <div className="authorization-card">

            <h3>
              🔐 Authorization Required
            </h3>

            <p>
              Enter the caregiver's email address.
              Your activity will only be shared after
              you authorize access.
            </p>

            <input
              type="email"
              value={caregiverEmail}
              onChange={(event) =>
                setCaregiverEmail(event.target.value)
              }
              placeholder="caregiver@example.com"
              className="caregiver-input"
            />

            <button
              className="primary-btn"
              onClick={authorizeCaregiver}
            >
              Authorize Caregiver Access →
            </button>

          </div>

          <div className="caregiver-privacy-note">
            🛡️ You can revoke caregiver access at any
            time.
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="page">

      <div className="caregiver-header">

        <div>
          <p className="small-title">
            CAREGIVER DASHBOARD
          </p>

          <h1>
            {userName}'s wellness overview.
          </h1>

          <p className="description">
            Authorized activity and cognitive training
            information in one place.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={revokeAccess}
        >
          Revoke Access
        </button>

      </div>

      <div className="caregiver-authorized-banner">
        <span>🔐</span>

        <div>
          <strong>
            Caregiver access is authorized
          </strong>

          <small>
            Authorized for {access?.caregiverEmail}
          </small>
        </div>
      </div>

      <div className="caregiver-stats">

        <div className="caregiver-stat">
          <span>🎮</span>

          <div>
            <small>Games Completed</small>

            <strong>
              {gamesCompleted}
            </strong>
          </div>
        </div>

        <div className="caregiver-stat">
          <span>🧠</span>

          <div>
            <small>Average Score</small>

            <strong>
              {averageScore}
            </strong>
          </div>
        </div>

        <div className="caregiver-stat">
          <span>🔥</span>

          <div>
            <small>Active Days</small>

            <strong>
              {currentStreak}
            </strong>
          </div>
        </div>

        <div className="caregiver-stat">
          <span>⏱️</span>

          <div>
            <small>Training Time</small>

            <strong>
              {totalMinutes} min
            </strong>
          </div>
        </div>

      </div>

      <div className="caregiver-grid">

        <div className="caregiver-card">

          <div className="caregiver-card-heading">

            <div>
              <span className="card-label">
                RECENT ACTIVITY
              </span>

              <h2>
                Training overview
              </h2>
            </div>

          </div>

          {recentScores.length === 0 ? (

            <div className="caregiver-empty">
              <span>🧠</span>

              <h3>
                No activity yet
              </h3>

              <p>
                Complete a cognitive game and the
                activity will appear here.
              </p>
            </div>

          ) : (

            recentScores.map((item) => (

              <div
                className="activity-row"
                key={item._id}
              >

                <span>
                  {item.game === "Memory Match"
                    ? "🧩"
                    : item.game ===
                      "Sequence Recall"
                    ? "🔢"
                    : item.game ===
                      "Reaction Challenge"
                    ? "⚡"
                    : "🔤"}
                </span>

                <div>
                  <strong>
                    {item.game}
                  </strong>

                  <small>
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}{" "}
                    ·{" "}
                    {item.difficulty}
                  </small>
                </div>

                <b>
                  {item.score}
                </b>

              </div>

            ))

          )}

        </div>

        <div className="caregiver-card">

          <span className="card-label">
            ACTIVITY SUMMARY
          </span>

          <h2>
            Training overview
          </h2>

          <p className="description">
            MindCare tracks completed activities and
            training history to provide a simple
            wellness overview.
          </p>

          <div className="caregiver-insight">

            <span>✨</span>

            <p>
              {gamesCompleted === 0
                ? "Start a cognitive game to build your activity history."
                : `You have completed ${gamesCompleted} cognitive ${
                    gamesCompleted === 1
                      ? "activity"
                      : "activities"
                  } across ${gameTypes} game ${
                    gameTypes === 1
                      ? "type"
                      : "types"
                  }.`}
            </p>

          </div>

        </div>

      </div>

      <div className="caregiver-card privacy-card">

        <span className="card-label">
          PRIVACY
        </span>

        <h2>
          Your data stays under your control.
        </h2>

        <p className="description">
          Caregiver access is currently authorized.
          The caregiver can view the activity available
          through this authorized connection. You can
          revoke access at any time.
        </p>

        <button
          className="secondary-btn"
          onClick={revokeAccess}
        >
          Revoke Caregiver Access
        </button>

      </div>

    </div>
  );
}

export default Caregiver;