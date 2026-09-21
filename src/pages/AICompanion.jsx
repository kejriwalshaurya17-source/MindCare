import { API_BASE } from "../api.js";
import { useState } from "react";

function AICompanion() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello Rohit 👋 I'm MindCare AI. How can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  async function sendMessage(event) {
    event.preventDefault();

    if (!input.trim()) return;

    const userText = input.trim();

    const userMessage = {
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      const aiMessage = {
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "MindCare AI backend se connection nahi ho pa raha.",
        },
      ]);
    }
  }

  return (
    <div className="page ai-page">

      <div className="ai-header">
        <div className="ai-avatar">🤖</div>

        <div>
          <p className="small-title">AI COMPANION</p>

          <h1>Talk with MindCare AI.</h1>

          <p className="description">
            A friendly companion for memory support, daily routines and
            cognitive wellness activities.
          </p>
        </div>
      </div>

      <div className="ai-chat-card">

        <div className="ai-status">
          <span className="status-dot"></span>
          MindCare AI is ready
        </div>

        <div className="ai-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.sender === "user"
                  ? "ai-message user-message"
                  : "ai-message"
              }
            >

              <div className="message-avatar">
                {message.sender === "user" ? "👤" : "🤖"}
              </div>

              <div className="message-bubble">
                {message.text}
              </div>

            </div>
          ))}

        </div>

        <form className="ai-input-area" onSubmit={sendMessage}>

          <button
            type="button"
            className="voice-btn"
          >
            🎤
          </button>

          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <button
            type="submit"
            className="send-btn"
          >
            ➤
          </button>

        </form>

      </div>

      <div className="ai-suggestions">

        <span className="card-label">
          QUICK PROMPTS
        </span>

        <div className="ai-prompt-grid">

          <button
            type="button"
            onClick={() => setInput("Give me a memory exercise")}
          >
            🧠 Memory exercise
          </button>

          <button
            type="button"
            onClick={() => setInput("Remind me about my routine")}
          >
            ⏰ My routine
          </button>

          <button
            type="button"
            onClick={() => setInput("Give me a focus activity")}
          >
            🎯 Focus activity
          </button>

          <button
            type="button"
            onClick={() => setInput("Tell me about my progress")}
          >
            📊 My progress
          </button>

        </div>

      </div>

    </div>
  );
}

export default AICompanion;