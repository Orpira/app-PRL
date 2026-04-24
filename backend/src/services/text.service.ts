export function splitText(text: string, maxLength = 3000): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const line of text.split("\n")) {
    if ((current + line).length > maxLength) {
      chunks.push(current);
      current = "";
    }
    current += line + "\n";
  }

  if (current) chunks.push(current);

  return chunks;
}