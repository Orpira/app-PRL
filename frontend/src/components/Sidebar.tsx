import { useState } from "react";
import {
	TbHome,
	TbBook2,
	TbListCheck,
	TbMessageChatbot,
	TbChartBar,
	TbBooks,
	TbSettings,
} from "react-icons/tb";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
	view: string;
	setView: (v: string) => void;
}

export default function Sidebar({ view, setView }: Props) {
	const user = useAuthStore((state) => state.user);
	const items = [
		{ id: "home", label: "Inicio", icon: <TbHome size={22} /> },
		{ id: "study", label: "Modo Estudio", icon: <TbBook2 size={22} /> },
		{ id: "exam", label: "Examen", icon: <TbListCheck size={22} /> },
		{ id: "chat", label: "Asistente IA", icon: <TbMessageChatbot size={22} /> },
		{ id: "stats", label: "Estadísticas", icon: <TbChartBar size={22} /> },
		{ id: "sources", label: "Fuentes IA", icon: <TbBooks size={22} /> },
		// Solo admins pueden ver el panel de administración
		...(user?.role === "admin"
			? [{ id: "admin", label: "Administración", icon: <TbSettings size={22} /> }]
			: []),
	];

	const [open, setOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(false);


	// Sidebar para desktop
	const sidebarContent = (
		<>
			<div className="flex-1 py-2">
				{items.map((item) => (
					<div
						key={item.id}
						onClick={() => setView(item.id)}
						className={`nav-item flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 cursor-pointer transition-all ${view === item.id ? "active bg-white/10" : ""}`}
						title={collapsed ? item.label : undefined}
					>
						<span className="text-xl">{item.icon}</span>
						{!collapsed && <span className="ml-1 text-sm font-medium">{item.label}</span>}
					</div>
				))}
			</div>
			<div className="sidebar-footer">
				{!collapsed && "Ley 31/1995 LPRL · v1.0"}
			</div>
		</>
	);

	return (
		<>
			{/* Sidebar fija en desktop, colapsable */}
			<div className={`sidebar h-screen hidden md:flex flex-col transition-all duration-300 ${collapsed ? "w-16 min-w-[56px]" : "w-56 min-w-[200px]"}`}>
				<button
					className="mt-3 mb-2 ml-auto mr-2 p-1 rounded hover:bg-white/10 text-white/60"
					onClick={() => setCollapsed((v) => !v)}
					aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
					title={collapsed ? "Expandir menú" : "Colapsar menú"}
				>
					<svg width="22" height="22" fill="none" viewBox="0 0 24 24">
						<path
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
						/>
					</svg>
				</button>
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
									className={`nav-item flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 cursor-pointer transition-all ${view === item.id ? "active bg-white/10" : ""}`}
								>
									<span className="text-xl">{item.icon}</span>
									<span className="ml-1 text-sm font-medium">{item.label}</span>
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
