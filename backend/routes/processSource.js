const express = require("express");
const multer = require("multer");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/legacy/build/pdf.worker.js");
const router = express.Router();

// 🔹 Multer config (memoria)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// 🔹 Fetch dinámico (Node)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// ==============================
// 🧠 UTIL: SAFE JSON PARSE
// ==============================
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return { error: "Invalid JSON from AI", raw: text };
    }
  }
}

// ==============================
// 🛡️ UTIL: VALIDADOR
// ==============================
function validateStructure(data) {
  if (!data || typeof data !== "object") return false;
  if (!Array.isArray(data.questions)) return false;

  return data.questions.every(q =>
    q.question &&
    Array.isArray(q.options) &&
    q.answer
  );
}

// ==============================
// 🧠 IA SERVICE
// ==============================
async function generateStructuredData(text) {
  const prompt = `
Devuelve SOLO un JSON válido con esta estructura:

{
  "title": "",
  "questions": [
    {
      "question": "",
      "options": [],
      "answer": "",
      "explanation": ""
    }
  ]
}

Texto:
${text}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "Devuelve SOLO JSON válido sin texto adicional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[OpenAI ERROR]", data);
    throw new Error("Error en OpenAI");
  }

  const content = data.choices?.[0]?.message?.content;

  return safeJSONParse(content);
}

// ==============================
// 📄 PARSER DE ENTRADA
// ==============================
async function extractText(type, file, rawText) {
  if (type === "pdf" && file) {
    const loadingTask = pdfjsLib.getDocument({ data: file.buffer });
    const pdf = await loadingTask.promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const strings = content.items.map(item => item.str);
      text += strings.join(" ") + "\n";
    }

    return text;
  }

  if (type === "json" && file) {
    return JSON.stringify(JSON.parse(file.buffer.toString()));
  }

  if (type === "text" && rawText) {
    return rawText;
  }

  throw new Error("Tipo de entrada no soportado");
}

// ==============================
// 🚀 ENDPOINT PRINCIPAL
// ==============================
router.post("/process-source", upload.single("file"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const body = req.body || {};
    const type = body.type;
    const rawText = body.rawText;
    const file = req.file;

    if (!type) {
      return res.status(400).json({
        error: "Falta type"
      });
    }

    // ======================
    // 📄 EXTRAER TEXTO
    // ======================
    const text = await extractText(type, file, rawText);

    const textToSend = text.slice(0, 4000);

    // ======================
    // 🧠 IA
    // ======================
    let structuredData = null;

    try {
      structuredData = await generateStructuredData(textToSend);

      if (!validateStructure(structuredData)) {
        structuredData = {
          fallback: true,
          raw: textToSend
        };
      }

    } catch (err) {
      console.error("IA ERROR:", err.message);

      structuredData = {
        error: "IA failed",
        raw: textToSend
      };
    }

    // ======================
    // RESPUESTA FINAL
    // ======================
    res.json({
      success: true,
      text: textToSend,
      structured: structuredData
    });

  } catch (err) {
    console.error("ERROR GENERAL:", err);

    res.status(500).json({
      error: "Error procesando fuente",
      details: err.message
    });
  }
});

module.exports = router;
