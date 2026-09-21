const express = require("express");
const jwt = require("jsonwebtoken");
const Feedback = require("./models/Feedback");
const User = require("./models/User");

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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


// SUBMIT FEEDBACK
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      category,
      game,
      rating,
      difficulty,
      message,
    } = req.body;

    if (!category || !rating || !message) {
      return res.status(400).json({
        message: "Category, rating and message are required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const feedback = await Feedback.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      category,
      game: game || null,
      rating,
      difficulty: difficulty || null,
      message,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Feedback error:", error);

    res.status(500).json({
      message: "Failed to submit feedback",
    });
  }
});


// GET USER'S OWN FEEDBACK
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const feedback = await Feedback.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json({
      feedback,
    });
  } catch (error) {
    console.error("Feedback fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch feedback",
    });
  }
});


module.exports = router;