import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { QUESTIONS } from "../../data/questions";
import {
	FaGavel, FaClipboardCheck, FaHardHat, FaExclamationTriangle, FaUserShield, FaUsers, FaRegFileAlt, FaChalkboardTeacher, FaStethoscope, FaAmbulance, FaFireExtinguisher, FaFlask, FaBiohazard, FaBolt, FaCogs, FaBalanceScale, FaBaby, FaBuilding, FaHandshake, FaClock, FaBrain, FaBook, FaTools, FaSitemap, FaUserNurse
} from "react-icons/fa";

const categoryIcons: Record<string, JSX.Element> = {
	"Ley 31/1995 LPRL": <FaGavel className="text-[#B8941F]" />,
	"Evaluación de Riesgos": <FaClipboardCheck className="text-[#1B3A6B]" />,
	"Equipos de Protección": <FaHardHat className="text-[#B8941F]" />,
	"Señalización": <FaExclamationTriangle className="text-[#EAB308]" />,
	"Delegados de Prevención": <FaUserShield className="text-[#0C1F3D]" />,
	"Comité de Seguridad": <FaUsers className="text-[#0C1F3D]" />,
	"Plan de Prevención": <FaRegFileAlt className="text-[#1B3A6B]" />,
	"Formación": <FaChalkboardTeacher className="text-[#B8941F]" />,
	"Servicios de Prevención": <FaStethoscope className="text-[#1B3A6B]" />,
	"Accidente de Trabajo": <FaAmbulance className="text-[#E11D48]" />,
	"Enfermedades Profesionales": <FaFireExtinguisher className="text-[#E11D48]" />,
	"Riesgos Químicos": <FaFlask className="text-[#0EA5E9]" />,
	"Riesgos Biológicos": <FaBiohazard className="text-[#16A34A]" />,
	"Riesgos Físicos": <FaBolt className="text-[#F59E42]" />,
	"Riesgos Ergonómicos": <FaCogs className="text-[#0C1F3D]" />,
	"Riesgos Psicosociales": <FaBrain className="text-[#A21CAF]" />,
	"Incendios": <FaFireExtinguisher className="text-[#E11D48]" />,
	"Primeros Auxilios": <FaAmbulance className="text-[#E11D48]" />,
	"Lugares de Trabajo": <FaBuilding className="text-[#0C1F3D]" />,
	"Trabajos Especiales": <FaTools className="text-[#1B3A6B]" />,
	"Coordinación de Actividades": <FaSitemap className="text-[#0C1F3D]" />,
	"Construcción": <FaHardHat className="text-[#B8941F]" />,
	"Responsabilidades y Sanciones": <FaBalanceScale className="text-[#B8941F]" />,
	"Vigilancia de la Salud": <FaUserNurse className="text-[#0EA5E9]" />,
	"Emergencias": <FaExclamationTriangle className="text-[#EAB308]" />,
	"Riesgos Eléctricos": <FaBolt className="text-[#F59E42]" />,
	"Manipulación Manual de Cargas": <FaBuilding className="text-[#0C1F3D]" />,
	"Trabajadoras Embarazadas": <FaBaby className="text-[#B8941F]" />,
	"Subcontratación": <FaHandshake className="text-[#1B3A6B]" />,
	"Trabajo a Turnos": <FaClock className="text-[#0C1F3D]" />,
	"Cultura Preventiva": <FaBook className="text-[#B8941F]" />,
};

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
					<div key={cat} onClick={() => onSelect(cat)} className="cat-card flex items-center gap-2">
						{categoryIcons[cat] || <FaBook className="text-[#B8941F]" />} <span>{cat}</span>
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
