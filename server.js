const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("BK Proxy funcionando 🚀");
});

// Endpoint del chatbot
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    // Respuesta simulada (aquí luego conectas NVIDIA)
    const reply = `Recibí tu mensaje: ${userMessage}`;

    console.log("USER:", userMessage);
    console.log("BOT:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUERTO (Railway lo asigna automáticamente)
const PORT = process.env.PORT;

// IMPORTANTE: 0.0.0.0 para Railway
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor activo en puerto", PORT);
});
