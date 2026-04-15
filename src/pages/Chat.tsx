import { useState } from "react";

export default function Chat() {
	const [messages, setMessages] = useState<string[]>([]);

	return (
		<div>
			<h2 className="mb-4">Asistente IA</h2>

			<div className="mb-4">
				{messages.map((m, i) => (
					<div key={i}>{m}</div>
				))}
			</div>

			<input className="border p-2 w-full" placeholder="Escribe..." />
		</div>
	);
}
