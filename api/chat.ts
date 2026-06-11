import { GoogleGenAI } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  // CORS configuration for security
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Can be restricted to your domain in production
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ error: "GEMINI_API_KEY is not configured on Vercel" });
    }

    const formattedHistory = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I am MediAssist AI. Ready to triage." }] },
    ];

    if (history && Array.isArray(history)) {
      for (const msg of history) {
        // Security: Limit input lengths to prevent token exhaustion attacks
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

    // Security: Limit history length
    if (formattedHistory.length > 20) {
      formattedHistory.splice(2, formattedHistory.length - 20); // Keep system prompt, remove older messages
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedHistory,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
       res.status(200).json(JSON.parse(response.text));
    } else {
       res.status(500).json({ error: "No response text found" });
    }
  } catch (error: any) {
    console.error("Error generating Gemini response:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
}
