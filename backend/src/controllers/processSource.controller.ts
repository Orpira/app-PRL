import { Request, Response } from "express";
import { extractPDFText } from "../services/pdf.service";
import { callOpenAI } from "../services/aiService";
import { splitText } from "../services/text.service";
import { safeJSONParse } from "../utils/safeParse";
import { validateQuiz } from "../utils/validator";
import { supabase } from "../config/supabase";

export async function processSource(req: Request, res: Response) {
  try {
    const { type, rawText } = req.body;
    const file = req.file as Express.Multer.File | undefined;

    let text = "";

    // ======================
    // 📄 EXTRAER TEXTO
    // ======================
    if (type === "pdf" && file) {
      text = await extractPDFText(file.buffer);
    } else if (type === "text" && rawText) {
      text = rawText;
    } else {
      return res.status(400).json({ error: "Invalid input" });
    }

    // ======================
    // 🧠 IA
    // ======================
    const chunks = splitText(text);

    let structuredData: any = null;

    for (const chunk of chunks.slice(0, 3)) {
      const content = await callOpenAI([
        {
          role: "system",
          content: `
        Devuelve SOLO JSON válido, sin texto adicional.

        Formato obligatorio:

        {
          "title": "string",
          "questions": [
            {
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "answer": "string",
              "explanation": "string"
            }
          ]
        }

        Reglas:
        - EXACTAMENTE 4 opciones por pregunta
        - "answer" debe ser una de las opciones
        - NO agregues texto fuera del JSON
        - NO uses markdown
        - NO expliques nada fuera del JSON
        `
        },
        { role: "user", content: chunk },
      ]);

      const parsed = safeJSONParse(content);

      if (validateQuiz(parsed)) {
        structuredData = parsed;
        break; // 🔥 nos quedamos con el primer válido
      }
    }

    // ======================
    // 🛡️ FALLBACK
    // ======================
    if (!structuredData) {
      structuredData = {
        fallback: true,
        raw: text.slice(0, 2000),
      };
    }

    // ======================
    // 💾 GUARDAR EN SUPABASE
    // ======================
    const { data, error } = await supabase.from("sources").insert({
      name: file?.originalname || "texto",
      type,
      content: text,
      ia_result: structuredData, // 🔥 ya no es array
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
    }

    // ======================
    // 🚀 RESPUESTA
    // ======================
    res.json({
      success: true,
      structured: structuredData,
    });

  } catch (err: any) {
    console.error("🔥 ERROR DETALLADO:", err);

    res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}