import { useState, useContext } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { AppContext } from "../context/AppContext";

export default function Login() {
	const login = useAuthStore((state) => state.login);
	const loading = useAuthStore((state) => state.loading);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const { setView } = useContext(AppContext);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		try {
			await login(email, password);
			setSuccess(true);
			setTimeout(() => setView("home"), 1200);
		} catch (err: any) {
			setError("Credenciales incorrectas o error de autenticación.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded shadow min-w-[320px]">
				<h2 className="text-xl mb-4">Iniciar sesión</h2>
				{error && <div className="mb-4 text-red-600">{error}</div>}
				{success && (
					<div className="mb-4 text-green-600">
						¡Bienvenido, <b>{email}</b>! Redirigiendo...
					</div>
				)}
				<form onSubmit={handleSubmit}>
					<input
						type="email"
						className="w-full border rounded px-3 py-2 mb-2"
						placeholder="Correo electrónico"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						className="w-full border rounded px-3 py-2 mb-2"
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<div className="flex gap-2 mt-2">
						<button className="btn flex-1" type="submit" disabled={loading}>
							{loading ? "Ingresando..." : "Iniciar sesión"}
						</button>
						<button
							className="btn btn-gold flex-1"
							onClick={() => setView("welcome")}
							type="button"
						>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
