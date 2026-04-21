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
app.options("*", cors({
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
		res.status(500).json({ error: "Error al conectar con OpenAI" });
	}
});

// --- LOGS DETALLADOS EN SUBIDA DE ARCHIVOS ---
app.post("/api/ia/process-source", upload.single("file"), async (req, res) => {
  try {
    console.log("[IA] Nueva petición de fuente:");
    console.log("- Tipo:", req.body.type);
    if (req.file) {
      console.log("- Archivo recibido:", req.file.originalname, "Tamaño:", req.file.size, "bytes");
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

    // Llamar a OpenAI para clasificar el texto
    const prompt = `Organiza el siguiente texto en categorías temáticas de PRL (Prevención de Riesgos Laborales). Devuelve un objeto JSON con las categorías detectadas y un resumen de cada una. Texto:\n${text.slice(0, 4000)}`;
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
    res.json({ text, ia: data });
  } catch (err) {
    res.status(500).json({ error: "Error procesando la fuente o llamando a IA" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`OpenAI proxy listening on port ${PORT}`);
});
