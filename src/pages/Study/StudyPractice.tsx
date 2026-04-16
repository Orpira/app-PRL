import { useState, useContext } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { AppContext } from "../../context/AppContext";

export default function StudyPractice({
	questions,
	onFinish,
}: {
	questions: Question[];
	onFinish: () => void;
}) {
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);
	const [finished, setFinished] = useState(false);
	const [correctCount, setCorrectCount] = useState(0);
	const user = useAuthStore((state) => state.user);
	const appContext = useContext(AppContext);

	// Debug: mostrar cuántas preguntas llegan
	if (!questions || questions.length === 0) {
		return (
			<div className="page">
				<div className="card">
					<h2 className="text-lg font-semibold mb-4">
						No hay preguntas para practicar
					</h2>
					<p className="mb-4 text-gray-700">
						Preguntas recibidas: {questions ? questions.length : 0}
					</p>
					<button className="btn btn-gold" onClick={onFinish}>
						Volver
					</button>
				</div>
			</div>
		);
	}

	const q = questions[index];
	const isLast = index === questions.length - 1;

	const handleSelect = (i: number) => {
		if (showResult) return;
		setSelected(i);
		setShowResult(true);
		if (i === q.r) setCorrectCount((c) => c + 1);
	};

	const handleNext = () => {
		if (isLast) {
			setFinished(true);
			return;
		}
		setIndex(index + 1);
		setSelected(null);
		setShowResult(false);
	};

	if (finished) {
		const total = questions.length;
		const ok = correctCount;
		const pct = Math.round((ok / total) * 100);
		return (
			<div className="page">
				<div className="card mb-4">
					<h2 className="text-lg font-semibold mb-4">Práctica finalizada</h2>
					<p className="mb-2 text-gray-700">
						Respuestas correctas: <b>{ok}</b> de <b>{total}</b>
					</p>
					<p className="mb-2 text-gray-700">
						Porcentaje de acierto: <b>{pct}%</b>
					</p>
					<button
						className="btn btn-gold mt-4"
						onClick={() => {
							if (user) appContext?.setView("home");
							else appContext?.setView("welcome");
						}}
					>
						Volver al inicio
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="page">
			<div className="flex items-center mb-2">
				<button
					className="text-gray-700 hover:underline mr-3 text-sm"
					onClick={() => {
						if (!user && window.setPracticeQsGlobal)
							window.setPracticeQsGlobal([]);
						onFinish();
					}}
					style={{ minWidth: 60 }}
				>
					← Volver
				</button>
				<span className="font-semibold text-base text-gray-800">
					Práctica: {q.cat}
				</span>
			</div>
			<div className="card mb-4">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm text-gray-700 font-medium">
						Pregunta {index + 1} de {questions.length}
					</span>
					<div className="w-1/2 h-1 bg-yellow-300 rounded-full ml-4">
						<div
							className="h-1 bg-yellow-700 rounded-full"
							style={{ width: `${((index + 1) / questions.length) * 100}%` }}
						/>
					</div>
				</div>
				<h3 className="font-semibold mb-4 text-lg text-gray-900">{q.q}</h3>
				<div className="space-y-2">
					{q.ops.map((op, i) => {
						let optClass =
							"flex items-center rounded px-4 py-2 cursor-pointer border transition-all text-base";
						let bg = "bg-white border-gray-200 hover:bg-gray-50";
						let letterClass = "font-bold mr-4 w-6 text-center";
						if (showResult) {
							if (i === q.r) {
								bg = "bg-green-100 border-green-300 text-green-900";
								letterClass += " text-green-900";
							} else if (selected === i) {
								bg = "bg-red-100 border-red-300 text-red-900";
								letterClass += " text-red-900";
							}
						} else if (selected === i) {
							bg = "bg-blue-50 border-blue-300 text-blue-900";
							letterClass += " text-blue-900";
						}
						return (
							<div
								key={i}
								onClick={() => handleSelect(i)}
								className={optClass + " " + bg}
								style={{ pointerEvents: showResult ? "none" : "auto" }}
							>
								<span className={letterClass}>
									{String.fromCharCode(65 + i)}
								</span>
								<span>{op}</span>
							</div>
						);
					})}
				</div>
				{showResult && (
					<div className="flex mt-6">
						<button
							onClick={handleNext}
							className={
								isLast ? "btn btn-gold ml-auto" : "btn btn-primary ml-auto"
							}
						>
							{isLast ? "Finalizar práctica" : "Siguiente →"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
