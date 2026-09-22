import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Lazy initialize Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      name: "FlowState Wellness",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI Wellness Coach Chat endpoint
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // High quality empathetic fallback guidance when API key is pending
        return res.json({
          reply: `Welcome to FlowState. Based on what you shared: "${message}", I recommend taking 3 slow, deep diaphragmatic breaths right now. Inhale for 4 counts, hold gently for 4, and exhale smoothly for 6. For your body today, consider pairing Child's Pose (Balasana) with a gentle seated Cat-Cow to release spinal tension. Once your Gemini API key is active in Settings, I will generate custom real-time adaptive sessions!`,
          source: "local-coach",
        });
      }

      const systemPrompt = `You are the FlowState AI Wellness Companion, a master holistic practitioner, 500-hr certified yoga instructor (E-RYT), somatic breathwork coach, and Ayurvedic lifestyle guide.
Your purpose is to offer compassionate, grounded, science-backed, and traditional wisdom to help users cultivate mindfulness, physical ease, hormonal harmony, and mental clarity.
User Context:
${context ? JSON.stringify(context) : "General practice"}

Guidelines:
1. Speak in a serene, encouraging, and soothing tone.
2. Recommend specific asanas (with Sanskrit names), breathing techniques (Pranayama), or somatic micro-practices when relevant.
3. Be mindful of cycle phases (Menstrual, Follicular, Ovulatory, Luteal) or energy states if mentioned.
4. Keep answers focused, practical, and formatted cleanly with subtle bullet points or short paragraphs.`;

      // Build conversation context
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === "user" || item.role === "user") {
            contents.push({ role: "user", parts: [{ text: item.text || item.content }] });
          } else if (item.sender === "ai" || item.role === "model") {
            contents.push({ role: "model", parts: [{ text: item.text || item.content }] });
          }
        }
      }

      contents.push({ role: "user", parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || "May peace and flow accompany your practice.",
        source: "gemini",
      });
    } catch (error: any) {
      console.error("AI Chat error:", error);
      // Graceful fallback for uninterrupted serenity
      const fallbacks = [
        "Take a slow, deep breath in through your nose, expanding your lower ribs, and exhale fully with a soft sigh. For physical tension, practicing Balasana (Child's Pose) or gentle Marjaryasana (Cat-Cow) provides immediate neuromuscular release while soothing the autonomic nervous system.",
        "Namaste. When feeling tension or stress, focus on extending your exhalations so they are twice as long as your inhalations. Ground your feet or sit on your heels, softening your jaw, shoulders, and eye muscles to invite calm awareness into the moment.",
        "In honoring your body's rhythm, gentle restorative postures like Supta Matsyendrasana (Supine Twist) and Viparita Karani (Legs-Up-The-Wall) facilitate lymphatic flow, down-regulate cortisol, and nourish your nervous system."
      ];
      const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      return res.json({
        reply: randomFallback,
        source: "local-coach",
        note: "Model currently busy; delivered via sanctuary wisdom engine",
      });
    }
  });

  // AI Personalized Routine Generator
  app.post("/api/gemini/routine", async (req, res) => {
    try {
      const { mood, energy, cyclePhase, physicalTension, availableMinutes } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // High quality structured fallback routine
        return res.json({
          title: "Harmonizing Flow & Gentle Release",
          durationMinutes: availableMinutes || 20,
          theme: "Nervous System Reset & Muscular Ease",
          breathwork: {
            name: "Nadi Shodhana (Alternate Nostril Breathing)",
            duration: "5 minutes",
            instructions: "Gentle balanced breathing to regulate the autonomic nervous system and soothe tension.",
          },
          asanas: [
            { name: "Balasana", english: "Child's Pose", duration: "3 min", focus: "Spine decompression & grounding" },
            { name: "Marjaryasana-Bitilasana", english: "Cat-Cow Flow", duration: "4 min", focus: "Spinal mobility & fluid breath" },
            { name: "Adho Mukha Svanasana", english: "Downward Facing Dog", duration: "3 min", focus: "Gentle full body elongation" },
            { name: "Supta Matsyendrasana", english: "Supine Spinal Twist", duration: "3 min", focus: "Lower back release" },
            { name: "Viparita Karani", english: "Legs-Up-The-Wall", duration: "5 min", focus: "Parasympathetic restoration" },
          ],
          affirmation: "I release what does not serve me and welcome ease into my body and mind.",
          source: "curated",
        });
      }

      const prompt = `Create a personalized, holistic yoga and mindfulness routine for a practitioner with:
- Mood: ${mood || "Reflective"}
- Energy Level: ${energy || "Moderate"}
- Cycle Phase: ${cyclePhase || "General"}
- Physical Tension Area: ${physicalTension || "Upper back and neck"}
- Available Time: ${availableMinutes || 20} minutes

Respond with ONLY valid JSON with this exact schema:
{
  "title": string,
  "durationMinutes": number,
  "theme": string,
  "breathwork": {
    "name": string,
    "duration": string,
    "instructions": string
  },
  "asanas": [
    {
      "name": string,
      "english": string,
      "duration": string,
      "focus": string
    }
  ],
  "affirmation": string
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "You are a master yoga sequence architect. Return only JSON matching the requested schema.",
        },
      });

      let routineData;
      try {
        routineData = JSON.parse(response.text?.trim() || "{}");
      } catch {
        routineData = null;
      }

      if (!routineData || !routineData.asanas) {
        throw new Error("Invalid format returned from model");
      }

      return res.json({
        ...routineData,
        source: "gemini",
      });
    } catch (error: any) {
      console.error("AI Routine error:", error);
      // Fallback response so user experience is always fluid
      return res.json({
        title: "Adaptive Flow & Somatic Centering",
        durationMinutes: 20,
        theme: "Cultivating Inner Peace",
        breathwork: {
          name: "Box Breathing (Sama Vritti)",
          duration: "4 minutes",
          instructions: "Inhale 4, hold 4, exhale 4, hold 4. Restores inner equilibrium.",
        },
        asanas: [
          { name: "Balasana", english: "Child's Pose", duration: "4 min", focus: "Grounding and breath awareness" },
          { name: "Uttanasana", english: "Standing Forward Fold", duration: "3 min", focus: "Hamstring and neck release" },
          { name: "Bhujangasana", english: "Cobra Pose", duration: "3 min", focus: "Heart opening and chest expansion" },
          { name: "Paschimottanasana", english: "Seated Forward Bend", duration: "4 min", focus: "Deep calming stretch" },
          { name: "Savasana", english: "Corpse Pose", duration: "6 min", focus: "Complete somatic integration" },
        ],
        affirmation: "With every breath, I anchor myself in clarity and strength.",
        source: "curated",
      });
    }
  });

  // Vite middleware for development
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
    console.log(`FlowState Wellness server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
