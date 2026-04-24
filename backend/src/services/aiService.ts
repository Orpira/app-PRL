type Message = {
  role: "system" | "user";
  content: string;
};

export async function callOpenAI(
  messages: Message[],
  retries = 2
): Promise<string> {
  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.3,
      }),
    });

    clearTimeout(timeout);

    const data = await res.json();

    if (!res.ok) throw new Error(data.error?.message);

    return data.choices?.[0]?.message?.content || "";

  } catch (err) {
    if (retries > 0) return callOpenAI(messages, retries - 1);
    throw err;
  }
}