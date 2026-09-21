import { API_BASE } from "../api.js";
import { useState } from "react";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setUserId(data.userId);
      setShowOTP(true);
      setMessage("OTP has been sent to your email.");
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha.");
    }
  }

  async function verifyOTP(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "OTP verification failed");
        return;
      }

      setMessage("Email verified successfully! You can now login.");

      setShowOTP(false);
      setIsSignup(false);
      setOtp("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage("OTP verification failed.");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setMessage("Backend se connection nahi ho raha.");
    }
  }

  function handleSubmit(event) {
    if (isSignup) {
      handleSignup(event);
    } else {
      handleLogin(event);
    }
  }

  return (
    <div className="page">
      <div className="login-card">

        <div className="ai-avatar">🧠</div>

        <p className="small-title">MINDCARE AI</p>

        {!showOTP ? (
          <>
            <h1>
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>

            <p className="description">
              {isSignup
                ? "Create an account to start your cognitive wellness journey."
                : "Login to continue your MindCare journey."}
            </p>

            <form onSubmit={handleSubmit}>

              {isSignup && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              )}

              <input
                type="email"
                placeholder="Gmail address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {isSignup && (
                <input
                  type="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              )}

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button type="submit" className="primary-btn">
                {isSignup ? "Create Account" : "Login"}
              </button>

            </form>
          </>
        ) : (
          <>
            <h1>Verify your email 📧</h1>

            <p className="description">
              We sent a 6-digit OTP to your email address.
              Enter it below to verify your account.
            </p>

            <form onSubmit={verifyOTP}>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                maxLength="6"
                required
              />

              <button type="submit" className="primary-btn">
                Verify OTP
              </button>

            </form>
          </>
        )}

        {message && <p>{message}</p>}

        {!showOTP && (
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign up"}
          </button>
        )}

      </div>
    </div>
  );
}

export default Login;