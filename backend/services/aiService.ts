export async function generateStructuredData(text: string) {
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
          content: "Devuelve SOLO JSON válido con preguntas tipo test"
        },
        {
          role: "user",
          content: text
        }
      ]
    })
  });

  const data = await response.json();

  if (!response.ok) throw new Error(JSON.stringify(data));

  return data.choices?.[0]?.message?.content;
}