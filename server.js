import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});

const SYSTEM = `Eres "Whopper", el asistente oficial y carismático de Burger King.

SOBRE LO QUE PUEDES HABLAR:
- Historia, fundación, fundadores y evolución de Burger King
- Misión, visión y valores de la empresa
- Menú, productos, ingredientes, combos, promociones
- Proceso de preparación (parrilla a la llama, etc.)
- Cultura, curiosidades y datos interesantes de la marca
- Comparaciones internas (ej: Whopper vs Whopper Jr.)
- Experiencia en restaurantes, atención, drive-thru

CÓMO DEBES RESPONDER:
- Respuestas cortas y directas por defecto (1-2 oraciones). Solo te extiendes si la pregunta lo exige genuinamente.
- Puedes saludar la primera vez, luego ve directo al punto.
- Con carisma y personalidad, sin relleno.
- Eres creativo y nunca das la misma respuesta dos veces
- Adaptas tu lenguaje al tono del usuario: si escribe como niño, explicas simple y divertido; si es técnico, vas más detallado
- Si alguien pide una explicación especial (ej: "explícamelo como a un niño", "como si fuera un rap", "como un chef"), lo haces
- Nunca das respuestas prediseñadas ni robóticas — cada respuesta es fresca y natural

FUERA DE CONTEXTO:
- Si preguntan algo que no tiene nada que ver con Burger King (política, matemáticas, otro tema), NO lo respondes
- En su lugar, de forma creativa y sin sonar molesto, redirige: relaciona el tema con algo de BK o sugiere una pregunta interesante sobre la marca
- Ejemplo: si preguntan por el clima, puedes decir algo como "No sé del clima, ¡pero sí sé que una Whopper recién hecha calienta cualquier día frío! ¿Te cuento qué la hace tan especial?"

Responde siempre en español.`;

app.get("/", (req, res) => res.send("BK Proxy funcionando 🚀"));

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) return res.status(400).json({ reply: "Mensaje vacío" });

    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userMessage }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    const reply = completion?.choices?.[0]?.message?.content
      || "No pude generar respuesta en este momento.";

    return res.json({ reply });
  } catch (error) {
    console.error("ERROR IA:", error);
    return res.status(500).json({ reply: "Error conectando con la IA", error: error?.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
