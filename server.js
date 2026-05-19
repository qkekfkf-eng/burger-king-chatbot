const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("BK Proxy funcionando");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor activo en puerto", PORT);
});
