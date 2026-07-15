import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Floriography custom bouquet compilation endpoint
app.post("/api/floriography", async (req, res) => {
  try {
    const { message, mood } = req.body;
    if (!message) {
      return res.status(400).json({ error: "A message or emotion is required." });
    }

    const ai = getGeminiClient();
    
    const prompt = `You are an expert Victorian Floriographer (specialist in the language of flowers). 
Translate the following user message/emotion into a carefully curated symbolic flower bouquet.
User Message/Emotion: "${message}"
Chosen Mood/Aesthetic: "${mood || "Victorian Romantic"}"

Select 3-4 specific flowers that together communicate the user's emotion. Write a poetic, beautiful response strictly matching the required JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elegant, artistic Victorian botanist who speaks with poetic grace and extensive historic knowledge of Floriography.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: {
              type: Type.STRING,
              description: "A beautifully written poetic introduction explaining the essence of this symbolic bouquet and how it speaks to their emotion."
            },
            flowers: {
              type: Type.ARRAY,
              description: "The set of 3 to 4 symbolic flowers making up the bouquet.",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the flower, e.g. 'Red Rose', 'Forget-Me-Not'." },
                  meaning: { type: Type.STRING, description: "The core floriography meaning in 1-3 words, e.g. 'Enduring Friendship'." },
                  color: { type: Type.STRING, description: "Color of this specific flower, e.g. 'Crimson Red', 'Velvet Gold'." },
                  symbolism: { type: Type.STRING, description: "A brief, 1-2 sentence historical context or folklore about why this flower carries this meaning." },
                  visualDescription: { type: Type.STRING, description: "A delicate, sensory visual description of how this flower looks in a bouquet, e.g. 'Velvety dark crimson buds with dewy edges'." }
                },
                required: ["name", "meaning", "color", "symbolism", "visualDescription"]
              }
            },
            poetry: {
              type: Type.STRING,
              description: "An elegant, short 3-stanza poem that weaves the selected flowers and their meanings into an intimate floral message."
            },
            careInstructions: {
              type: Type.STRING,
              description: "A whimsical, botanical care tip on how to 'tend' to these emotions or this virtual bouquet."
            }
          },
          required: ["introduction", "flowers", "poetry", "careInstructions"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response generated from the model.");
    }

    const parsedData = JSON.parse(textOutput);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Floriography error:", error);
    res.status(500).json({ 
      error: "Could not compile your bouquet.", 
      message: error.message || "Unknown error occurred" 
    });
  }
});

// Care advisor chatbot endpoint
app.post("/api/botanist-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGeminiClient();

    // Map client messages to Gemini content format
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: "You are 'Brother Thyme', a humble and wise resident botanical gardener and flower whisperer. You have a deep love for soil, pruning, watering, blooming cycles, and the historical folklore of garden plants. Answer the user's questions about gardening, flower care, botany, or floral layouts with warmth, practical advice, and a touch of organic wisdom. Keep answers beautifully structured, encouraging, and highly informative."
      }
    });

    const reply = response.text || "I am currently lost in the glasshouse. Let me consult my journals.";
    res.json({ text: reply });
  } catch (error: any) {
    console.error("Botanist chat error:", error);
    res.status(500).json({ 
      error: "The botanist is busy weeding.", 
      message: error.message || "Unknown error occurred" 
    });
  }
});

// Vite Middleware & Static Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
