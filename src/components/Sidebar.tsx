interface Props {
	view: string;
	setView: (v: string) => void;
}

export default function Sidebar({ view, setView }: Props) {
	const items = [
		{ id: "home", label: "Inicio", icon: "▤" },
		{ id: "study", label: "Modo Estudio", icon: "◈" },
		{ id: "exam", label: "Examen", icon: "◉" },
		{ id: "chat", label: "Asistente IA", icon: "◎" },
		{ id: "stats", label: "Estadísticas", icon: "◍" },
	];

	return (
		<div className="sidebar h-screen">
			<div className="logo">
				<div className="logo-title">PRL Master</div>
				<div className="logo-sub">Prevención de Riesgos Laborales</div>
			</div>
			<div className="flex-1 py-2">
				{items.map((item) => (
					<div
						key={item.id}
						onClick={() => setView(item.id)}
						className={`nav-item${view === item.id ? " active" : ""}`}
					>
						<span>{item.icon}</span> {item.label}
					</div>
				))}
			</div>
			<div className="sidebar-footer">Ley 31/1995 LPRL · v1.0</div>
		</div>
	);
}
