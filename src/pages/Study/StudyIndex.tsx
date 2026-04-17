import { useContext, useState, useEffect } from "react";


import { AppContext } from "../../context/AppContext";
import { QUESTIONS } from "../../data/questions";

const CATS = [...new Set(QUESTIONS.map((q) => q.cat))];

export default function StudyIndex({
	onSelect,
	limit,
	studyCat,
}: {
	onSelect: (cat: string) => void;
	limit?: number;
	studyCat?: string | null;
}) {
	const catsToShow = limit ? CATS.slice(0, limit) : CATS;
	const appContext = useContext(AppContext);
	const [hasPracticeQs, setHasPracticeQs] = useState(false);

	useEffect(() => {
		const checkPracticeQs = () => {
			setHasPracticeQs(
				Array.isArray(window.practiceQsGlobal) && window.practiceQsGlobal.length > 0,
			);
		};
		window.addEventListener("practiceQsChange", checkPracticeQs);
		checkPracticeQs();
		return () => {
			window.removeEventListener("practiceQsChange", checkPracticeQs);
		};
	}, []);

	return (
		<div className="page">
			<h2 className="page-title mb-4">Modo Estudio</h2>
			<div className="grid4">
				{catsToShow.map((cat) => (
					<div key={cat} onClick={() => onSelect(cat)} className="cat-card">
						{cat}
					</div>
				))}
			</div>
			{/* Botón volver solo para modo demo, sin preguntas activas y sin categoría seleccionada */}
			{limit && !hasPracticeQs && !studyCat && (
				<button
					className="btn btn-gold mt-6"
					onClick={() => {
						if (window.setPracticeQsGlobal) window.setPracticeQsGlobal([]);
						if (typeof window !== "undefined") {
							window.practiceQsGlobal = [];
							window.dispatchEvent(new Event("practiceQsChange"));
						}
						appContext?.setView("welcome");
					}}
				>
					← Volver
				</button>
			)}
		</div>
	);
}
