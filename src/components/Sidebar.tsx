import { useState } from "react";

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

	const [open, setOpen] = useState(false);

	// Sidebar para desktop
	const sidebarContent = (
		<>
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
		</>
	);

	return (
		<>
			{/* Sidebar fija en desktop */}
			<div className="sidebar h-screen hidden md:flex">
				{sidebarContent}
			</div>

			{/* Botón hamburguesa y sidebar móvil */}
			<div className="md:hidden">
				<button
					className="fixed top-4 left-4 z-40 p-2 rounded-md bg-[#0C1F3D] text-white shadow-lg focus:outline-none"
					onClick={() => setOpen((v) => !v)}
					aria-label="Abrir menú"
				>
					<svg width="28" height="28" fill="none" viewBox="0 0 24 24">
						<path
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>

				{/* Overlay y menú lateral */}
				{open && (
					<>
						<div
							className="fixed inset-0 bg-black/40 z-30"
							onClick={() => setOpen(false)}
						/>
						<div className="fixed top-0 left-0 h-full w-64 bg-[#0C1F3D] z-40 flex flex-col animate-slideIn">
							<button
								className="self-end m-4 p-2 text-white"
								onClick={() => setOpen(false)}
								aria-label="Cerrar menú"
							>
								<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
									<path
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
							{items.map((item) => (
								<div
									key={item.id}
									onClick={() => {
										setView(item.id);
										setOpen(false);
									}}
									className={`nav-item${view === item.id ? " active" : ""}`}
								>
									<span>{item.icon}</span> {item.label}
								</div>
							))}
							<div className="sidebar-footer mt-auto">Ley 31/1995 LPRL · v1.0</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
