import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import * as pdfParse from "pdf-parse";
dotenv.config();

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || "*");
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.options(/^\/api\/.*$/, cors({
  origin: (origin, callback) => {
    callback(null, origin || "*");
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/openai/chat", async (req, res) => {
         try {
           const { messages } = req.body;
           const response = await fetch("https://api.openai.com/v1/chat/completions", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${OPENAI_API_KEY}`,
             },
             body: JSON.stringify({
               model: "gpt-3.5-turbo",
               messages,
               max_tokens: 300,
             }),
           });
           const data = await response.json();
           res.json(data);
         } catch (err) {
           console.error("[OpenAI Chat Error]", err);
           res.status(500).json({ error: "Error al conectar con OpenAI", details: err?.message || err });
         }
});

// --- LOGS DETALLADOS EN SUBIDA DE ARCHIVOS ---
app.post("/api/ia/process-source", upload.single("file"), async (req, res) => {
  try {
    console.log("[IA] Nueva petición de fuente:");
    console.log("- Tipo:", req.body.type);
    if (req.file) {
      console.log("- Archivo recibido:", req.file.originalname, "Tamaño:", req.file.size, "bytes");
      if (req.file.size > 20 * 1024 * 1024) {
        return res.status(400).json({ error: "El archivo supera el límite de 20MB." });
      }
      if (!req.body.type || (req.body.type !== "pdf" && req.body.type !== "json")) {
        return res.status(400).json({ error: "Tipo de archivo no soportado. Solo PDF o JSON." });
      }
    } else {
      console.log("- Sin archivo, texto manual:", req.body.rawText ? req.body.rawText.slice(0, 100) + "..." : "");
    }
    let text = "";
    const { file } = req;
    const { type, rawText } = req.body;
    if (type === "pdf" && file) {
      const data = await pdfParse(file.buffer);
      text = data.text;
      console.log("- Texto extraído de PDF, primeros 100 caracteres:", text.slice(0, 100));
    } else if (type === "json" && file) {
      const json = JSON.parse(file.buffer.toString());
      text = JSON.stringify(json);
      console.log("- Texto extraído de JSON, primeros 100 caracteres:", text.slice(0, 100));
    } else if (type === "text" && rawText) {
      text = rawText;
      console.log("- Texto manual, primeros 100 caracteres:", text.slice(0, 100));
    } else {
      console.log("- Error: tipo de archivo o datos no soportados");
      return res.status(400).json({ error: "Tipo de archivo o datos no soportados" });
    }

    // Limitar el texto a 4000 caracteres para la IA
    let textToSend = text;
    let recortado = false;
    if (text.length > 4000) {
      textToSend = text.slice(0, 4000);
      recortado = true;
    }

    // Llamar a OpenAI para clasificar el texto
    const prompt = `Organiza el siguiente texto en categorías temáticas de PRL (Prevención de Riesgos Laborales). Devuelve un objeto JSON con las categorías detectadas y un resumen de cada una. Texto:\n${textToSend}`;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Eres un experto en PRL y clasificación documental." },
            { role: "user", content: prompt },
          ],
          max_tokens: 600,
        }),
      });
      const data = await response.json();
      res.json({ text: textToSend, ia: data, recortado });
    } catch (err) {
      console.error("[OpenAI Process Source Error]", err);
      res.status(500).json({ error: "1. Error procesando la fuente o llamando a IA", details: err?.message || err });
    }
  } catch (err) {
    console.error("[Process Source Error]", err);
    res.status(500).json({ error: "2. Error procesando la fuente o llamando a IA", details: err?.message || err });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`OpenAI proxy listening on port ${PORT}`);
});
