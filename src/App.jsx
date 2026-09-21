import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import Games from "./pages/Games";
import Memory from "./pages/Memory";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import MemoryMatch from "./pages/MemoryMatch";
import SequenceRecall from "./pages/SequenceRecall";
import ReactionChallenge from "./pages/ReactionChallenge";
import WordRecall from "./pages/WordRecall";
import Caregiver from "./pages/Caregiver";
import AICompanion from "./pages/AICompanion";
import Login from "./pages/Login";
import Help from "./pages/HelpPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.name || "User";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    window.location.href = "/login";
  }

  return (
    <BrowserRouter>
      <div className="app">

        <header className="navbar">

          <Link to="/" className="logo">
            <span>🧠</span>
            <h2>MindCare</h2>
          </Link>

          {isLoggedIn && (
            <nav>
              <Link to="/">Home</Link>
              <Link to="/games">Games</Link>
              <Link to="/memory">Memory</Link>
              <Link to="/progress">Progress</Link>
              <Link to="/reminders">Reminders</Link>
              <Link to="/caregiver">Caregiver</Link>
              <Link to="/ai-companion">AI Companion</Link>
            </nav>
          )}

          <div className="navbar-actions">

            {isLoggedIn ? (
              <>
                <span className="navbar-user">
                  👋 {userName}
                </span>

                <Link to="/profile" className="profile-btn">
                  Profile
                </Link>

                <button
                  type="button"
                  className="profile-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="profile-btn">
                Login
              </Link>
            )}

          </div>

        </header>

        <main className="home">

          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              }
            />

            <Route
              path="/memory"
              element={
                <ProtectedRoute>
                  <Memory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <Progress />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reminders"
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/caregiver"
              element={
                <ProtectedRoute>
                  <Caregiver />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ai-companion"
              element={
                <ProtectedRoute>
                  <AICompanion />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/memory-match"
              element={
                <ProtectedRoute>
                  <MemoryMatch />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/sequence-recall"
              element={
                <ProtectedRoute>
                  <SequenceRecall />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/reaction-challenge"
              element={
                <ProtectedRoute>
                  <ReactionChallenge />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/word-recall"
              element={
                <ProtectedRoute>
                  <WordRecall />
                </ProtectedRoute>
              }
            />

      <Route
  path="/help"
  element={
    <ProtectedRoute>
      <Help />
    </ProtectedRoute>
  }
/>

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;