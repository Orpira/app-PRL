import { useState } from "react";
import { QUESTIONS } from "../../data/questions";

export default function ExamSetup({
	onStart,
}: {
	onStart: (data: { name: string; questions: any[] }) => void;
}) {
	const [name, setName] = useState("");
	const [numQuestions, setNumQuestions] = useState(20);
	const totalQuestions = QUESTIONS.length;

	const start = () => {
		const shuffled = [...QUESTIONS]
			.sort(() => Math.random() - 0.5)
			.slice(0, numQuestions);
		onStart({ name, questions: shuffled });
	};

	return (
		<div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
			<h2 className="mb-4 text-lg font-semibold">Configurar Examen</h2>
			<div className="mb-4">
				<label className="block mb-1 font-medium">
					Nombre (para el certificado)
				</label>
				<input
					type="text"
					className="w-full border rounded px-3 py-2"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Nombre completo"
				/>
			</div>
			<div className="mb-4">
				<label className="block mb-1 font-medium">Número de preguntas</label>
				<div className="flex gap-4 flex-wrap">
					{/* Botón de 5 preguntas solo si hay más de 5 preguntas */}
					{totalQuestions > 5 && (
						<button
							type="button"
							className={`px-4 py-2 rounded border ${numQuestions === 5 ? "bg-[#181C44] text-white" : "bg-gray-100"}`}
							onClick={() => setNumQuestions(5)}
						>
							5<div className="text-xs mt-1">10 min</div>
						</button>
					)}
					{[20, 50, 100].map((n) => (
						<button
							key={n}
							type="button"
							className={`px-4 py-2 rounded border ${numQuestions === n ? "bg-[#181C44] text-white" : "bg-gray-100"}`}
							onClick={() => setNumQuestions(n)}
						>
							{n}
							<div className="text-xs mt-1">{n * 1.5} min</div>
						</button>
					))}
				</div>
			</div>
			<button
				onClick={start}
				className="bg-[#B8941F] text-white px-4 py-2 rounded w-full"
				disabled={!name.trim()}
			>
				Iniciar examen
			</button>
		</div>
	);
}
