export function safeJSONParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return { error: "Invalid JSON", raw: text };
    }
  }
}