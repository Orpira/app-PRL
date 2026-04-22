
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const multer = require("multer");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const pdfParse = require("pdf-parse");

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


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supabase
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


// Route for AI chat (original backend)
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });
    const reply = response.output[0].content[0].text;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en OpenAI" });
  }
});

// Proxy endpoint for OpenAI chat (from openai-proxy.mjs)
app.post("/api/openai/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
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

// Endpoint for /api/ia/process-source (from openai-proxy.mjs)
app.post("/api/ia/process-source", upload.single("file"), async (req, res) => {
  try {
    console.log("[IA] Nueva petición de fuente:");
    console.log("- Tipo:", req.body.type);
    if (req.file) {
      console.log("- Archivo recibido:", req.file.originalname, "Tamaño:", req.file.size, "bytes");
      if (req.file.size > 20 * 1024 * 1024) {
        return res.status(400).json({ error: "El archivo supera el límite de 20MB." });
      }
      if (!req.body.type || !["pdf", "json", "text"].includes(req.body.type)) {
        return res.status(400).json({ error: "Tipo de archivo no soportado. Solo PDF o JSON." });
      }
    } else {
      console.log("- Sin archivo, texto manual:", req.body.rawText ? req.body.rawText.slice(0, 100) + "..." : "");
    }
    let text = "";
    const { file } = req;
    const { type, rawText } = req.body;
    if (type === "pdf" && file) {
      try {
        const data = await pdfParse(file.buffer);
        text = data.text;
        console.log("- Texto extraído de PDF, primeros 100 caracteres:", text.slice(0, 100));
      } catch (pdfErr) {
        console.error("[Error extrayendo PDF]", pdfErr);
        return res.status(500).json({ error: "Error extrayendo texto del PDF", details: pdfErr?.message || pdfErr });
      }
    } else if (type === "json" && file) {
      try {
        const json = JSON.parse(file.buffer.toString());
        text = JSON.stringify(json);
        console.log("- Texto extraído de JSON, primeros 100 caracteres:", text.slice(0, 100));
      } catch (jsonErr) {
        console.error("[Error extrayendo JSON]", jsonErr);
        return res.status(500).json({ error: "Error extrayendo texto del JSON", details: jsonErr?.message || jsonErr });
      }
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

    // Llamar a OpenAI para clasificar el texto (opcional, puedes comentar si no quieres IA)
    let iaData = null;
    try {
      const prompt = `Organiza el siguiente texto en categorías temáticas de PRL (Prevención de Riesgos Laborales). Devuelve un objeto JSON con las categorías detectadas y un resumen de cada una. Texto:\n${textToSend}`;
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Eres un experto en PRL y clasificación documental. Devuelve SOLO JSON válido." },
      { role: "user", content: prompt },
    ],
    max_tokens: 600,
  }),
});

const data = await response.json();

if (!response.ok) {
  console.error("[OpenAI ERROR]:", data);
  return res.status(500).json({ error: "OpenAI falló", details: data });
}

let content = data.choices?.[0]?.message?.content;

try {
  iaData = JSON.parse(content);
} catch {
  iaData = content; // fallback
}

    //iaData = data.choices?.[0]?.message?.content || null;
    iaData = "TEST OK";
    } catch (err) {
      console.error("[OpenAI Process Source Error]", err);
      // No retornamos error, solo dejamos iaData en null
    }

    // Guardar en Supabase
    try {
      const { data: insertData, error: insertError } = await supabase.from('sources').insert([
        {
          name: req.file?.originalname || 'manual',
          type,
          content: textToSend,
          ia_result: iaData,
          created_at: new Date().toISOString(),
        }
      ]).select();
      if (insertError) {
        console.error('[Supabase Insert Error]', insertError);
        return res.status(500).json({ error: 'Error guardando en Supabase', details: insertError.message });
      }
      res.json({ text: textToSend, ia: iaData, recortado, supabase: insertData });
    } catch (dbErr) {
      console.error('[Supabase Exception]', dbErr);
      res.status(500).json({ error: 'Error inesperado guardando en Supabase', details: dbErr?.message || dbErr });
    }
  } catch (err) {
    console.error("[Process Source Error]", err);
    res.status(500).json({ error: "2. Error procesando la fuente o llamando a IA", details: err?.message || err });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor unificado corriendo en http://localhost:${PORT}`);
});