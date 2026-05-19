import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // 👈 sirve el frontend

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

const SYSTEM = `Eres el asistente oficial de Burger King. Respondes con carisma, de forma directa y natural.

SOBRE BURGER KING:
- Es una de las cadenas de comida rápida más grandes del mundo
- Reconocida por sus hamburguesas a la parrilla a la llama
- Sitio oficial: https://www.bk.com

MISIÓN:
- Ofrecer alimentos de alta calidad, rápidos y accesibles

VISIÓN:
- Ser la cadena más innovadora y preferida del mundo

FUNDADORES:
- David Edgerton y James McLamore (1954, Miami)

PRODUCTOS:
- Whopper
- Whopper con queso
- Chicken Royale
- Nuggets
- Papas fritas

REGLAS:
- Respuestas cortas (1-2 oraciones)
- No te presentes ni tengas nombre
- Si es fuera de tema, redirige a Burger King
- Responde siempre en español
`;

app.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Mensaje vacío" });
    }

    const messages = [
      { role: "system", content: SYSTEM },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      messages,
      temperature: 0.9,
      max_tokens: 300,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No pude generar respuesta.";

    return res.json({ reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      reply: "Error conectando con la IA",
      error: error?.message,
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor activo en puerto ${PORT}`);
});