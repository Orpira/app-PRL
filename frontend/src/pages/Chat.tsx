import { useState, useRef } from "react";

const SUGGESTED = [
	"¿Cuáles son los principios de la acción preventiva?",
	"¿Qué es un delegado de prevención?",
	"¿Cuándo se debe evacuar ante un incendio?",
	"¿Diferencia entre accidente y enfermedad profesional?",
];

export default function Chat() {
	const [messages, setMessages] = useState<
		{ role: "user" | "ia"; text: string }[]
	>([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Llamada a IA usando endpoint MCP
	const MCP_ENDPOINT = "http://localhost:3001/api/openai/chat";

	async function askIA(question: string) {
		setLoading(true);
		setMessages((msgs) => [...msgs, { role: "user", text: question }]);
		setInput("");
		try {
			const res = await fetch(MCP_ENDPOINT, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [
						{
							role: "system",
							content:
								"Eres un experto en prevención de riesgos laborales y normativa española.",
						},
						...messages.map((m) => ({ role: m.role, content: m.text })),
						{ role: "user", content: question },
					],
					// Puedes agregar aquí otros parámetros requeridos por tu MCP
				}),
			});
			if (!res.ok) throw new Error("Error en la IA");
			const data = await res.json();
			// Ajusta el path según la respuesta de tu MCP
			const answer =
				data.choices?.[0]?.message?.content ||
				data.answer ||
				"No se pudo obtener respuesta.";
			setMessages((msgs) => [...msgs, { role: "ia", text: answer }]);
		} catch (e) {
			setMessages((msgs) => [
				...msgs,
				{ role: "ia", text: "Error al conectar con la IA." },
			]);
		}
		setLoading(false);
		inputRef.current?.focus();
	}

	function handleSend(e?: React.FormEvent) {
		if (e) e.preventDefault();
		if (!input.trim() || loading) return;
		askIA(input.trim());
	}

	return (
		<div className="flex flex-col h-[80vh] max-w-4xl mx-auto mt-8 bg-white rounded shadow p-8 relative">
			<h2 className="text-xl font-semibold mb-1">
				Asistente IA — Experto en PRL
			</h2>
			<div className="text-gray-600 mb-6">
				Consulta cualquier duda sobre prevención de riesgos laborales y
				normativa española
			</div>

			{messages.length === 0 && (
				<div className="flex flex-col items-center justify-center flex-1">
					<div className="text-5xl mb-2">💬</div>
					<div className="mb-4 text-center text-gray-700 font-medium">
						Haz tu primera pregunta sobre PRL
					</div>
					<div className="flex flex-wrap gap-4 justify-center mb-8">
						{SUGGESTED.map((q) => (
							<button
								key={q}
								className="text-sm underline text-[#181C44] hover:text-[#B8941F]"
								onClick={() => askIA(q)}
								disabled={loading}
							>
								{q}
							</button>
						))}
					</div>
				</div>
			)}

			<div className="flex-1 overflow-y-auto mb-4">
				{messages.map((m, i) => (
					<div
						key={i}
						className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`rounded-lg px-4 py-2 max-w-[70%] whitespace-pre-line ${
								m.role === "user"
									? "bg-[#181C44] text-white self-end"
									: "bg-gray-100 text-gray-900 self-start"
							}`}
						>
							{m.text}
						</div>
					</div>
				))}
				{loading && (
					<div className="text-gray-400 text-sm text-center">Pensando...</div>
				)}
			</div>

			<form
				className="flex gap-2 items-center absolute left-0 right-0 bottom-0 p-4 bg-white border-t"
				onSubmit={handleSend}
			>
				<input
					ref={inputRef}
					className="flex-1 border rounded px-3 py-2"
					placeholder="Escribe tu pregunta sobre PRL..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					disabled={loading}
				/>
				<button
					type="submit"
					className="bg-[#181C44] text-white px-4 py-2 rounded disabled:opacity-60"
					disabled={loading || !input.trim()}
				>
					Enviar
				</button>
			</form>
		</div>
	);
}
