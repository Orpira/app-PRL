export function safeJSONParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      return { error: "Invalid JSON", raw: text };
    }
  }
}