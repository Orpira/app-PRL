// import Card from "../components/Card"; // No usado
import { QUESTIONS } from "../data/questions";
import { THEORY } from "../data/theory";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useAuthStore } from "../store/useAuthStore";
import { getUserStats } from "../store/getUserStats";
import { 
	FaGavel, FaClipboardCheck, FaHardHat, FaExclamationTriangle, FaUserShield, FaUsers, FaRegFileAlt, FaChalkboardTeacher, FaStethoscope, FaAmbulance, FaFireExtinguisher, FaFlask, FaBiohazard, FaBolt, FaCogs, FaBalanceScale, FaBaby, FaBuilding, FaHandshake, FaClock, FaBrain, FaBook, FaTools, FaSitemap, FaUserNurse, FaWarehouse
} from "react-icons/fa";
// Mapeo de categorías a iconos
const categoryIcons: Record<string, React.ReactElement> = {
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
	"Manipulación Manual de Cargas": <FaWarehouse className="text-[#0C1F3D]" />,
	"Trabajadoras Embarazadas": <FaBaby className="text-[#0C1F3D]" />,
	"Subcontratación": <FaHandshake className="text-[#0C1F3D]" />,
	"Trabajo a Turnos": <FaClock className="text-[#0C1F3D]" />,
	"Cultura Preventiva": <FaBook className="text-[#0C1F3D]" />,
};

export default function Home() {
	const appContext = useContext(AppContext);
	const user = useAuthStore((state) => state.user);
	const [guestStats, setGuestStats] = useState({
		examenes: 0,
		media: 0,
		mejor: 0,
	});
	const [userStats, setUserStats] = useState({
		examenes: 0,
		media: 0,
		mejor: 0,
	});
	const [exploreDone, setExploreDone] = useState(
		Boolean(localStorage.getItem("explore_exam_done")),
	);

	// Permitir acceso a setLoginMessage de App
	const setLoginMessage = appContext?.setLoginMessage;

	useEffect(() => {
		if (!user) {
			const local = JSON.parse(
				localStorage.getItem("exam_results_local") || "[]",
			);
			const examenes = local.length;
			let media = 0;
			let mejor = 0;
			if (local.length > 0) {
				media = Math.round(
					local.reduce((acc: number, r: any) => acc + (r.percentage || 0), 0) / local.length,
				);
				mejor = Math.max(...local.map((r: any) => r.percentage || 0));
			}
			setGuestStats({ examenes, media, mejor });
			setExploreDone(Boolean(localStorage.getItem("explore_exam_done")));
		} else if (user.id) {
			getUserStats(user.id)
				.then(setUserStats);
		}
	}, [user, appContext]);

	const handleExamClick = () => {
		if (!user && exploreDone) {
			if (setLoginMessage)
				setLoginMessage(
					"Debes iniciar sesión para acceder a más categorías y exámenes ilimitados.",
				);
			appContext?.setView("login");
			return;
		}
		appContext?.setView("exam");
	};

	const stats = {
		preguntas: QUESTIONS.length,
		examenes: user ? userStats.examenes : guestStats.examenes,
		media: user ? userStats.media : guestStats.media,
		mejor: user ? userStats.mejor : guestStats.mejor,
	};
	const categorias = Object.keys(THEORY);

	// Si no hay datos, mostrar mensaje de bienvenida
	if (!user && !exploreDone && guestStats.examenes === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<h1 className="text-2xl font-bold mb-4">Bienvenido al curso</h1>
				<p className="text-center mb-4">
					Para acceder a todas las funcionalidades, regístrate o inicia sesión.
				</p>
				<button
					className="btn btn-primary"
					onClick={() => appContext?.setView("study")}
				>
					Iniciar modo estudio
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col md:flex-row gap-8">
			{/* Panel principal */}
			<div className="flex-1 min-w-0">
				<h1 className="page-title mb-1">Panel Principal</h1>
				<div className="page-sub mb-6">
					Curso Básico de Prevención de Riesgos Laborales — Ley 31/1995
				</div>
								 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
									 <div className="card group flex flex-col items-center py-6 transition-transform hover:scale-[1.03] hover:shadow-lg dark:bg-card dark:border-none">
										 <div className="stat-num text-3xl font-bold text-accent mb-1 transition-colors group-hover:text-[#1B3A6B] dark:group-hover:text-[#4F8CFF]">{stats.preguntas}</div>
										 <div className="stat-label text-xs text-muted">Preguntas</div>
									 </div>
									 <div className="card group flex flex-col items-center py-6 transition-transform hover:scale-[1.03] hover:shadow-lg dark:bg-card dark:border-none">
										 <div className="stat-num text-3xl font-bold text-accent mb-1 transition-colors group-hover:text-[#1B3A6B] dark:group-hover:text-[#4F8CFF]">{stats.examenes}</div>
										 <div className="stat-label text-xs text-muted">Exámenes realizados</div>
									 </div>
									 <div className="card group flex flex-col items-center py-6 transition-transform hover:scale-[1.03] hover:shadow-lg dark:bg-card dark:border-none">
										 <div className="stat-num text-3xl font-bold text-accent mb-1 transition-colors group-hover:text-[#1B3A6B] dark:group-hover:text-[#4F8CFF]">{stats.media}%</div>
										 <div className="stat-label text-xs text-muted">Puntuación media</div>
									 </div>
									 <div className="card group flex flex-col items-center py-6 transition-transform hover:scale-[1.03] hover:shadow-lg dark:bg-card dark:border-none">
										 <div className="stat-num text-3xl font-bold text-accent mb-1 transition-colors group-hover:text-[#1B3A6B] dark:group-hover:text-[#4F8CFF]">{stats.mejor}%</div>
										 <div className="stat-label text-xs text-muted">Mejor resultado</div>
									 </div>
								 </div>


								 <div className="mb-8">
									 <div className="mb-3 font-semibold text-center text-base tracking-tight">Accesos rápidos</div>
									 <div className="flex flex-col gap-3 max-w-xs mx-auto items-center">
										 <button
											 className="btn btn-primary w-full shadow-sm hover:shadow-md transition"
											 onClick={() => appContext?.setView("study")}
										 >
											 Iniciar modo estudio
										 </button>
										 <button className="btn btn-gold w-full shadow-sm hover:shadow-md transition" onClick={handleExamClick}>
											 Realizar examen
										 </button>
										 <button
											 className="btn btn-outline w-full shadow-sm hover:shadow-md transition"
											 onClick={() => {
												 if (!user) {
													 localStorage.removeItem("exam_results_local");
													 setGuestStats({ examenes: 0, media: 0, mejor: 0 });
												 } else {
													 alert("Funcionalidad de reset para usuarios registrados no implementada. Ve a la pantalla de estadísticas para resetear tus datos.");
												 }
											 }}
										 >
											 Resetear estadísticas
										 </button>
										 {user && (
											 <button
												 className="btn w-full shadow-sm hover:shadow-md transition"
												 onClick={() => appContext?.setView("chat")}
											 >
												 Consultar al asistente IA
											 </button>
										 )}
										 {/* Botón para regresar a welcome solo en modo demo */}
										 {!user && (
											 <button
												 className="btn btn-outline mt-2 w-full shadow-sm hover:shadow-md transition"
												 onClick={() => appContext?.setView("welcome")}
											 >
												 Volver al inicio
											 </button>
										 )}
									 </div>
								 </div>
			</div>

			{/* Temario a la derecha */}
			<div className="w-full md:w-[340px] lg:w-[400px] xl:w-[480px] flex-shrink-0">
				<div className="mb-2 font-medium">
					Temario ({categorias.length} categorías)
				</div>
							 <div className="flex flex-wrap gap-3 max-h-[420px] overflow-y-auto pr-2">
								 {categorias.map((cat, i) =>
									 !user && i >= 4 ? null : (
										 <div
											 key={cat}
											 className="cat-card group flex items-center gap-3 min-w-[180px] max-w-full bg-white dark:bg-card border border-gray-200 dark:border-[#23262F] rounded-xl p-3 cursor-pointer transition-all hover:shadow-md hover:border-accent dark:hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
											 tabIndex={0}
											 title={cat}
											 role="button"
											 aria-label={cat}
										 >
											 <span className="text-xl group-hover:scale-110 transition-transform">
												 {categoryIcons[cat] || <FaBook className="text-[#0C1F3D] dark:text-accent" />}
											 </span>
											 <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
												 {cat}
											 </span>
										 </div>
									 ),
								 )}
							 </div>
			</div>
		</div>
	);
}
