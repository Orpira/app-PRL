// import Card from "../components/Card"; // No usado
import { QUESTIONS } from "../data/questions";
import { THEORY } from "../data/theory";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useAuthStore } from "../store/useAuthStore";
import { getUserStats } from "../store/getUserStats";

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
				<div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
					<div className="stat-card">
						<div className="stat-num">{stats.preguntas}</div>
						<div className="stat-label">Preguntas</div>
					</div>
					<div className="stat-card">
						<div className="stat-num">{stats.examenes}</div>
						<div className="stat-label">Exámenes realizados</div>
					</div>
					<div className="stat-card">
						<div className="stat-num">{stats.media}%</div>
						<div className="stat-label">Puntuación media</div>
					</div>
					<div className="stat-card">
						<div className="stat-num">{stats.mejor}%</div>
						<div className="stat-label">Mejor resultado</div>
					</div>
				</div>

				<div className="mb-8">
					<div className="mb-2 font-medium text-center">Accesos rápidos</div>
					<div className="flex flex-col gap-2 max-w-xs mx-auto items-center">
						<button
							className="btn btn-primary w-full"
							onClick={() => appContext?.setView("study")}
						>
							Iniciar modo estudio
						</button>
						<button className="btn btn-gold w-full" onClick={handleExamClick}>
							Realizar examen
						</button>
						{user && (
							<button
								className="btn w-full"
								onClick={() => appContext?.setView("chat")}
							>
								Consultar al asistente IA
							</button>
						)}
						{/* Botón para regresar a welcome solo en modo demo */}
						{!user && (
							<button
								className="btn btn-outline mt-2 w-full"
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
				<div className="flex flex-wrap gap-2 max-h-[420px] overflow-y-auto pr-2">
					{categorias.map((cat, i) =>
						!user && i >= 4 ? null : (
							<span
								key={cat}
								className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs text-gray-800 border border-gray-200"
								title={cat}
							>
								{cat}
							</span>
						),
					)}
				</div>
			</div>
		</div>
	);
}
