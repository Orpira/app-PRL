import { THEORY } from "../../data/theory";
import { QUESTIONS } from "../../data/questions";
import Button from "../../components/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

interface StudyCategoryProps {
	cat: string;
	onPractice: () => void;
	onBack?: () => void;
}

const ICONS: Record<string, string> = {
	"Accidente de Trabajo": "⚠️",
	Emergencias: "🚨",
	"Riesgos Químicos": "🧪",
	"Riesgos Biológicos": "🦠",
	"Riesgos Físicos": "💥",
	"Riesgos Ergonómicos": "🧍",
	"Riesgos Psicosociales": "🧠",
	"Enfermedades Profesionales": "🏥",
	"Equipos de Protección": "🦺",
	Señalización: "🚧",
	"Plan de Prevención": "📝",
	Formación: "🎓",
	"Vigilancia de la Salud": "🩺",
	"Delegados de Prevención": "👷",
	"Comité de Seguridad": "👥",
	"Servicios de Prevención": "🏢",
	"Ley 31/1995 LPRL": "📜",
};

export default function StudyCategory({
	cat,
	onPractice,
	onBack,
}: StudyCategoryProps) {
	const theory = THEORY[cat as keyof typeof THEORY] || [];
	const numPractice = QUESTIONS.filter((q) => q.cat === cat).length;
	const icon = ICONS[cat] || "📚";
	const user = useAuthStore((state) => state.user);
	const appContext = useContext(AppContext);

	return (
		<div className="page">
			<div className="flex items-center mb-2">
				<button
					className="text-gray-700 hover:underline mr-3 text-sm"
					onClick={() => {
						if (!user && window.setPracticeQsGlobal)
							window.setPracticeQsGlobal([]);
						if (!user) {
							appContext?.setView("welcome");
						} else if (onBack) {
							onBack();
						}
					}}
					style={{ minWidth: 60 }}
				>
					← Volver
				</button>
				<h2 className="page-title flex items-center gap-2 mb-0">
					<span className="text-2xl">{icon}</span> {cat}
				</h2>
			</div>
			<div className="card mb-4">
				<ul className="list-disc ml-6">
					{theory.map((t: string, i: number) => (
						<li
							key={i}
							className="mb-2 text-[15px] text-gray-800 flex items-start gap-2"
						>
							<span className="text-yellow-600 mt-1">●</span>
							<span>{t}</span>
						</li>
					))}
				</ul>
			</div>
			<div className="flex items-center justify-between mt-2">
				<span className="text-sm text-gray-700">
					{numPractice} pregunta{numPractice === 1 ? "" : "s"} de práctica
					disponible{numPractice === 1 ? "" : "s"}
				</span>
				<Button variant="primary" onClick={onPractice}>
					Practicar <span aria-hidden>→</span>
				</Button>
			</div>
		</div>
	);
}
