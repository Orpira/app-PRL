

export async function extractText(type: string, file: any, rawText: string) {
  if (type === "pdf" && file) {
    const data = await pdfParse(file.buffer);
    return data.text;
  }

  if (type === "json" && file) {
    return JSON.stringify(JSON.parse(file.buffer.toString()));
  }

  if (type === "text") {
    return rawText;
  }

  throw new Error("Tipo no soportado");
}

// @ts-ignore
const pdf = require('pdf-parse');

async function pdfParse(buffer: Buffer): Promise<{ text: string }> {
  return await pdf(buffer);
}
