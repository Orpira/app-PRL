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

import {
	FaGavel, FaClipboardCheck, FaHardHat, FaExclamationTriangle, FaUserShield, FaUsers, FaRegFileAlt, FaChalkboardTeacher, FaStethoscope, FaAmbulance, FaFireExtinguisher, FaFlask, FaBiohazard, FaBolt, FaCogs, FaBalanceScale, FaBaby, FaBuilding, FaHandshake, FaClock, FaBrain, FaBook, FaTools, FaSitemap, FaUserNurse
} from "react-icons/fa";

const categoryIcons: Record<string, JSX.Element> = {
	"Ley 31/1995 LPRL": <FaGavel className="text-[#0C1F3D]" />,
	"Evaluación de Riesgos": <FaClipboardCheck className="text-[#0C1F3D]" />,
	"Equipos de Protección": <FaHardHat className="text-[#0C1F3D]" />,
	"Señalización": <FaExclamationTriangle className="text-[#0C1F3D]" />,
	"Delegados de Prevención": <FaUserShield className="text-[#0C1F3D]" />,
	"Comité de Seguridad": <FaUsers className="text-[#0C1F3D]" />,
	"Plan de Prevención": <FaRegFileAlt className="text-[#0C1F3D]" />,
	"Formación": <FaChalkboardTeacher className="text-[#0C1F3D]" />,
	"Servicios de Prevención": <FaStethoscope className="text-[#0C1F3D]" />,
	"Accidente de Trabajo": <FaAmbulance className="text-[#0C1F3D]" />,
	"Enfermedades Profesionales": <FaFireExtinguisher className="text-[#0C1F3D]" />,
	"Riesgos Químicos": <FaFlask className="text-[#0C1F3D]" />,
	"Riesgos Biológicos": <FaBiohazard className="text-[#0C1F3D]" />,
	"Riesgos Físicos": <FaBolt className="text-[#0C1F3D]" />,
	"Riesgos Ergonómicos": <FaCogs className="text-[#0C1F3D]" />,
	"Riesgos Psicosociales": <FaBrain className="text-[#0C1F3D]" />,
	"Incendios": <FaFireExtinguisher className="text-[#0C1F3D]" />,
	"Primeros Auxilios": <FaAmbulance className="text-[#0C1F3D]" />,
	"Lugares de Trabajo": <FaBuilding className="text-[#0C1F3D]" />,
	"Trabajos Especiales": <FaTools className="text-[#0C1F3D]" />,
	"Coordinación de Actividades": <FaSitemap className="text-[#0C1F3D]" />,
	"Construcción": <FaHardHat className="text-[#0C1F3D]" />,
	"Responsabilidades y Sanciones": <FaBalanceScale className="text-[#0C1F3D]" />,
	"Vigilancia de la Salud": <FaUserNurse className="text-[#0C1F3D]" />,
	"Emergencias": <FaExclamationTriangle className="text-[#0C1F3D]" />,
	"Riesgos Eléctricos": <FaBolt className="text-[#0C1F3D]" />,
	"Manipulación Manual de Cargas": <FaBuilding className="text-[#0C1F3D]" />,
	"Trabajadoras Embarazadas": <FaBaby className="text-[#0C1F3D]" />,
	"Subcontratación": <FaHandshake className="text-[#0C1F3D]" />,
	"Trabajo a Turnos": <FaClock className="text-[#0C1F3D]" />,
	"Cultura Preventiva": <FaBook className="text-[#0C1F3D]" />,
};

export default function StudyCategory({
	cat,
	onPractice,
	onBack,
}: StudyCategoryProps) {
	const theory = THEORY[cat as keyof typeof THEORY] || [];
	const numPractice = QUESTIONS.filter((q) => q.cat === cat).length;
	const icon = categoryIcons[cat] || <FaBook className="text-[#0C1F3D]" />;
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
