import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/openai/chat", async (req, res) => {
	try {
		const { messages } = req.body;
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages,
				max_tokens: 300,
			}),
		});
		const data = await response.json();
		res.json(data);
	} catch (err) {
		res.status(500).json({ error: "Error al conectar con OpenAI" });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`OpenAI proxy listening on port ${PORT}`);
});
