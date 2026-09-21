const mongoose = require("mongoose");

const gameScoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    game: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    time: {
      type: Number,
      default: 0,
    },

    difficulty: {
      type: String,
      default: "Easy",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GameScore", gameScoreSchema);