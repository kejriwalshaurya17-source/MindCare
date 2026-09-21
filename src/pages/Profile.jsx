import { useState } from "react";

function Profile() {
  const [language, setLanguage] = useState("English");
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const userName = user?.name || "User";
  const userEmail = user?.email || "No email";
  const userPhone = user?.phone || "No phone";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  }

  return (
    <div className="page">

      <div className="profile-header">
        <div className="profile-avatar">
          {initials}
        </div>

        <div>
          <p className="small-title">MY PROFILE</p>

          <h1>Welcome back, {userName}.</h1>

          <p className="description">
            Manage your profile and personalize your MindCare experience.
          </p>
        </div>
      </div>


      <div className="settings-section">

        <div className="settings-heading">
          <span>👤</span>

          <div>
            <h2>Personal Information</h2>
            <p>Your basic profile information.</p>
          </div>
        </div>

        <div className="profile-grid">

          <div className="profile-field">
            <label>Full Name</label>
            <div>{userName}</div>
          </div>

          <div className="profile-field">
            <label>Email</label>
            <div>{userEmail}</div>
          </div>

          <div className="profile-field">
            <label>Mobile Number</label>
            <div>{userPhone}</div>
          </div>

          <div className="profile-field">
            <label>Member Since</label>
            <div>
              {user?.id ? "September 2026" : "Not available"}
            </div>
          </div>

        </div>

      </div>


      <div className="settings-section">

        <div className="settings-heading">
          <span>⚙️</span>

          <div>
            <h2>Preferences</h2>
            <p>Customize how MindCare works for you.</p>
          </div>
        </div>


        <div className="setting-row">

          <div>
            <strong>Language</strong>
            <p>Choose your preferred language.</p>
          </div>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
          </select>

        </div>


        <div className="setting-row">

          <div>
            <strong>Large Text</strong>
            <p>Make text easier to read.</p>
          </div>

          <button
            className={
              largeText
                ? "settings-toggle on"
                : "settings-toggle"
            }
            onClick={() => setLargeText(!largeText)}
          >
            {largeText ? "ON" : "OFF"}
          </button>

        </div>


        <div className="setting-row">

          <div>
            <strong>High Contrast</strong>
            <p>Increase visual contrast for accessibility.</p>
          </div>

          <button
            className={
              highContrast
                ? "settings-toggle on"
                : "settings-toggle"
            }
            onClick={() => setHighContrast(!highContrast)}
          >
            {highContrast ? "ON" : "OFF"}
          </button>

        </div>


        <div className="setting-row">

          <div>
            <strong>Reduced Motion</strong>
            <p>Reduce animations and visual movement.</p>
          </div>

          <button
            className={
              reducedMotion
                ? "settings-toggle on"
                : "settings-toggle"
            }
            onClick={() => setReducedMotion(!reducedMotion)}
          >
            {reducedMotion ? "ON" : "OFF"}
          </button>

        </div>

      </div>


      <div className="settings-section">

        <div className="settings-heading">
          <span>🔒</span>

          <div>
            <h2>Privacy & Safety</h2>
            <p>Your information should remain under your control.</p>
          </div>
        </div>


        <div className="privacy-items">

          <div>
            <strong>🔐 Personal Data</strong>
            <p>
              Your memories and activity data are intended for
              your personal MindCare experience.
            </p>
          </div>


          <div>
            <strong>👥 Caregiver Access</strong>
            <p>
              Caregiver access should only be available when you
              explicitly authorize it.
            </p>
          </div>


          <div>
            <strong>🧠 Cognitive Wellness</strong>
            <p>
              MindCare provides wellness and memory-support
              activities, not medical diagnosis.
            </p>
          </div>

        </div>

      </div>


      <div className="settings-section">

        <div className="settings-heading">
          <span>🚪</span>

          <div>
            <h2>Account</h2>
            <p>Manage your MindCare account and get support.</p>
          </div>
        </div>


        <a href="/help" className="profile-help-link">
          ❓ Help & Support
        </a>


        <button
          type="button"
          className="primary-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;