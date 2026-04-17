import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { generateCertificate } from "../../shared/lib/generateCertificate";
import { saveResult } from "../../store/saveResult";
import { useAuthStore } from "../../store/useAuthStore";
import type { Question } from "../../types";

interface ExamResultProps {
	questions: Question[];
	answers: (number | null)[];
	userName: string;
	// onRetry eliminado completamente
}

function getCategoryStats(questions: Question[], answers: (number | null)[]) {
	const stats: Record<string, { total: number; correct: number }> = {};
	questions.forEach((q, i) => {
		if (!stats[q.cat]) stats[q.cat] = { total: 0, correct: 0 };
		stats[q.cat].total++;
		if (answers[i] === q.r) stats[q.cat].correct++;
	});
	return stats;
}

export default function ExamResult({
	questions,
	answers,
	userName,
}: ExamResultProps) {
	const appContext = useContext(AppContext);
	const setView = appContext?.setView ?? null;
	const ok = questions.reduce(
		(acc, q, i) => acc + (answers[i] === q.r ? 1 : 0),
		0,
	);
	const tot = questions.length;
	const pct = Math.round((ok / tot) * 100);
	const passed = pct >= 60;
	const stats = getCategoryStats(questions, answers);

	// Obtener usuario
	const user = useAuthStore((state) => state.user);

	// Guardar resultado en Supabase/localStorage solo una vez
	useEffect(() => {
		const result = {
			ok,
			total: tot,
			pct,
			passed,
		};
		// Solo si hay preguntas y respuestas
		if (tot > 0 && answers.length === tot) {
			saveResult(result, user?.id);
		}
		// eslint-disable-next-line
	}, []);

	return (
		<div className="max-w-5xl mx-auto mt-8 flex flex-col items-center">
			{/* Banner superior */}
			<div className="w-full bg-[#181C44] border-4 border-[#B8941F] rounded-md mb-8 flex flex-col items-center justify-center p-8 relative">
				<div className="absolute left-8 top-8 text-4xl">
					{passed ? "✔️" : "✗"}
				</div>
				<div className="text-center">
					<div className="uppercase tracking-widest text-gray-300 text-sm mb-2">
						RESULTADO FINAL
					</div>
					<div
						className={`text-3xl font-bold mb-2 ${passed ? "text-white" : "text-red-300"}`}
					>
						{passed ? "APTO" : "NO APTO"} — {pct}%
					</div>
					<div className="mb-4 text-gray-200 text-lg">
						{ok} de {tot} respuestas correctas
					</div>
					{passed && (
						<button
							className="bg-[#FFD600] hover:bg-[#B8941F] text-[#181C44] font-semibold px-6 py-2 rounded transition-colors"
							onClick={() => generateCertificate(userName, pct)}
						>
							Descargar certificado
						</button>
					)}
				</div>
			</div>

			{/* Desglose por categoría */}
			<div className="w-full max-w-2xl bg-white rounded shadow p-6 mb-8">
				<h3 className="font-semibold mb-4 text-lg">Desglose por categoría</h3>
				<ul className="space-y-2">
					{Object.entries(stats).map(([cat, { total, correct }]) => {
						const percent = Math.round((correct / total) * 100);
						let barColor = "bg-green-500";
						if (percent === 0) barColor = "bg-red-500";
						else if (percent < 60) barColor = "bg-yellow-400";
						return (
							<li key={cat} className="flex items-center gap-4">
								<span className="w-56 truncate text-sm font-medium">{cat}</span>
								<div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
									<div className={barColor} style={{ width: `${percent}%` }} />
								</div>
								<span
									className={`w-20 text-right text-sm font-mono ${percent === 100 ? "text-green-700" : percent === 0 ? "text-red-600" : "text-yellow-700"}`}
								>
									{correct}/{total} ({percent}%)
								</span>
							</li>
						);
					})}
				</ul>
			</div>

			{/* Botones de acción */}
			<div className="flex gap-4 mt-2">
				<button
					className="bg-[#181C44] text-white px-4 py-2 rounded"
					onClick={() => {
						if (setView) setView("exam");
						// Llevar a la pantalla de configuración del examen
						if (typeof window !== "undefined") {
							// Forzar el paso a setup si existe setExamStep en el contexto superior
							const evt = new CustomEvent("goToExamSetup");
							window.dispatchEvent(evt);
						}
					}}
				>
					Nuevo examen
				</button>
				<button
					className="bg-[#181C44] text-white px-4 py-2 rounded"
					onClick={() => {
						if (setView) setView("study");
						else window.location.hash = "#study";
					}}
				>
					Estudiar áreas de mejora
				</button>
			</div>
		</div>
	);
}
