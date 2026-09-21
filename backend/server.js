const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const chatRouter = require("./chat");

const app = express();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./auth"));
app.use("/api/scores", require("./scores"));
app.use("/api/chat", chatRouter);
app.use("/api/caregiver", require("./caregiver"));
app.use("/api/feedback", require("./feedback"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "MindCare AI",
  });
});

// Render provides PORT at runtime; keep 5000 for local development.
const PORT = process.env.PORT || 5000;

// Serve the Vite production build when this backend is deployed as one Render service.
const frontendDist = path.join(__dirname, "..", "dist");
app.use(express.static(frontendDist));

// React Router needs the index page for direct navigation to client-side routes.
// Keep this fallback after all /api routes and after static-file middleware.
app.get(/^(?!\/api(?:\/|$)).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`MindCare server listening on port ${PORT}`);
});