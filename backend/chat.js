const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: `You are MindCare AI, a friendly cognitive wellness companion.

User message:
${message}

Reply naturally and specifically to the user's message. Keep the response helpful, simple and friendly.`,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI response failed",
    });
  }
});

module.exports = router;