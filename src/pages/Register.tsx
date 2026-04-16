import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function Register() {
	const register = useAuthStore((state) => state.register);
	const loading = useAuthStore((state) => state.loading);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(false);
		if (password !== confirmPassword) {
			setError("Las contraseñas no coinciden.");
			return;
		}
		try {
			await register(email, password);
			setSuccess(true);
			setEmail("");
			setPassword("");
			setConfirmPassword("");
		} catch (err: any) {
			setError(err?.message || "No se pudo registrar. ¿El correo ya existe?");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded shadow min-w-[320px]">
				<h2 className="text-xl mb-4">Registro</h2>
				{error && <div className="mb-4 text-red-600">{error}</div>}
				{success && (
					<div className="mb-4 text-green-600">
						¡Registro exitoso! Revisa tu correo para confirmar antes de iniciar
						sesión.
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
					<input
						type="password"
						className="w-full border rounded px-3 py-2 mb-2"
						placeholder="Confirmar contraseña"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					<div className="flex gap-2 mt-2">
						<button className="btn flex-1" type="submit" disabled={loading}>
							{loading ? "Registrando..." : "Registrarse"}
						</button>
						<button
							className="btn btn-gold flex-1"
							onClick={() => window.location.reload() || setView?.("welcome")}
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
