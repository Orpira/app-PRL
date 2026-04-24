export function validateQuiz(data: any): boolean {
  if (!data || typeof data !== "object") return false;

  if (!Array.isArray(data.questions)) return false;

  return data.questions.every((q: any) => {
    return (
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length > 0 &&
      typeof q.answer === "string"
    );
  });
}