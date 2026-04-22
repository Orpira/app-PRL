export function validateStructure(data: any) {
  if (!data) return false;
  if (!Array.isArray(data.questions)) return false;

  return data.questions.every(q => q.question && q.options);
}