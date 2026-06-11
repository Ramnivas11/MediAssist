import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const systemPrompt = `You are MediAssist AI, a healthcare triage assistant for NGOs.

Your responsibilities:
1. Understand user query
2. Classify intent:
   - Patient Support
   - Volunteer Registration
   - Medical Query
3. Detect urgency:
   - Low
   - Medium
   - High
   - Emergency

Return ONLY valid JSON:

{
  "intent": "",
  "urgency": "",
  "reply": "",
  "action": "",
  "risk_notes": ""
}`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
    }

    const formattedHistory = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am MediAssist AI. Ready to triage." }] },
    ];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        formattedHistory.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: String(msg.parts?.[0]?.text || msg.text || "").substring(0, 1000) }]
        });
      }
    }

    formattedHistory.push({
      role: "user",
      parts: [{ text: String(message).substring(0, 1000) }]
    });

    // Limit history length to prevent abuse
    if (formattedHistory.length > 20) {
      formattedHistory.splice(2, formattedHistory.length - 20);
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedHistory,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
       res.json(JSON.parse(response.text));
    } else {
       res.status(500).json({ error: "No response text found" });
    }
  } catch (error: any) {
    console.error("Error generating Gemini response:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
