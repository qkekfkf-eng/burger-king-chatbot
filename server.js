import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

// ===== NVIDIA CLIENT =====
const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

// ===== TEST =====
app.get("/", (req, res) => {
  res.send("BK Proxy funcionando 🚀");
});

// ===== CHAT =====
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Mensaje vacío" });
    }

    console.log("USER:", userMessage);

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente de Burger King. Responde natural, corto y en español."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    console.log("RAW RESPONSE:", JSON.stringify(completion, null, 2));

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No pude generar respuesta en este momento.";

    console.log("BOT:", reply);

    return res.json({ reply });

  } catch (error) {
    console.error("ERROR IA:", error);

    return res.status(500).json({
      reply: "Error conectando con la IA",
      error: error?.message
    });
  }
});

// ===== START =====
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});
