const express = require("express");
const jwt = require("jsonwebtoken");
const GameScore = require("./models/GameScore");

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { game, score, time, difficulty } = req.body;

    if (!game || score === undefined) {
      return res.status(400).json({
        message: "Game and score are required",
      });
    }

    const gameScore = await GameScore.create({
      userId: req.userId,
      game,
      score,
      time: time || 0,
      difficulty: difficulty || "Easy",
    });

    res.status(201).json({
      message: "Game score saved successfully",
      score: gameScore,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to save game score",
    });
  }
});
// GET ALL SCORES OF LOGGED-IN USER
router.get("/", authenticateToken, async (req, res) => {
  try {
    const scores = await GameScore.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      scores,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch game scores",
    });
  }
});

module.exports = router;