import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1", // 🚨 Required for OpenRouter!
});

router.post("/analyze", async (req, res) => {
  const { jsonData } = req.body;

  if (!jsonData || !Array.isArray(jsonData)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
const prompt = `You are a business analyst. Analyze the JSON data below and return insights in well-structured points with categories like Trends, Anomalies, Top Performers, Suggestions. Use line breaks and emojis for each point. Format for user-friendly frontend display:\n\n${JSON.stringify(jsonData).slice(0, 4000)}`;

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // ✅ or try "openchat/openchat-3.5-0106"
      messages: [{ role: "user", content: prompt }],
    });

    const insights = completion.choices[0].message.content;

    res.json({ success: true, insights });
  } catch (err) {
    console.error("OpenRouter API error:", err);
    res.status(500).json({ message: "AI analysis failed" });
  }
});

export default router;
