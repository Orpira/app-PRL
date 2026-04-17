import { useAuthStore } from "../store/useAuthStore";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

export default function NavBar() {
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);
	const [loading, setLoading] = useState(false);
	const appContext = useContext(AppContext);
	const setView = appContext && "setView" in appContext ? appContext.setView : undefined;
	// Acceso a setters globales si existen
	const setPracticeQs = window.setPracticeQsGlobal;
	const setStudyCat = window.setStudyCatGlobal;

	if (!user) return null;

	const handleLogout = async () => {
		setLoading(true);
		await logout();
		setLoading(false);
		if (setPracticeQs) setPracticeQs([]);
		if (setStudyCat) setStudyCat(null);
		if (setView) setView("welcome");
	};

	return (
		<nav className="w-full flex items-center justify-between bg-gray-800 text-white px-6 py-3 shadow">
			<div className="logo">
				<div className="logo-title">PRL Master</div>
				<div className="logo-sub">Prevención de Riesgos Laborales</div>
			</div>
			<div className="flex items-center gap-4">
				<span className="text-sm">{user.email}</span>
				<button
					className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
					onClick={handleLogout}
					disabled={loading}
				>
					{loading ? "Cerrando..." : "Cerrar sesión"}
				</button>
			</div>
		</nav>
	);
}
// ...eliminar return duplicado y limpiar estructura...
