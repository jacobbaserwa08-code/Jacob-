import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Lazy AI client getter
  let aiClient: GoogleGenAI | null = null;
  function getGenAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Quincaillerie vie nouvelle" });
  });

  // AI Hardware & Inventory Assistant API Endpoint
  app.post("/api/ai/advice", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const ai = getGenAI();

      const systemInstruction = `Tu es le conseiller expert de "Quincaillerie vie nouvelle", une quincaillerie professionnelle proposant outillage, plomberie, électricité, matériaux de construction, peinture et fixation.
      Fournis des conseils clairs, précis et pratiques en français (ou anglais si demandé).
      Si le contexte concerne l'inventaire ou les stocks, suggère des quantités de réapprovisionnement, des estimations de matériaux pour projets (ex: béton, peinture, plomberie, câblage) ou des conseils d'optimisation des coûts.
      Sois structuré avec des puces, des formules ou des estimations chiffrées si pertinent.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemInstruction}\n\nContexte actuel du magasin: ${JSON.stringify(
                  context || {}
                )}\n\nQuestion / Demande du client ou gérant: ${prompt}`,
              },
            ],
          },
        ],
      });

      res.json({ advice: response.text });
    } catch (error: any) {
      console.error("AI API Error:", error);
      res.status(500).json({
        error: error.message || "Erreur lors de la génération des conseils IA.",
      });
    }
  });

  // Serve static files or Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server "Quincaillerie vie nouvelle" running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
