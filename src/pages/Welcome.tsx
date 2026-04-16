import { useAuthStore } from "../store/useAuthStore";

export default function Welcome({
	onLogin,
	onRegister,
	onGuest,
}: {
	onLogin: () => void;
	onRegister: () => void;
	onGuest: () => void;
}) {
	const user = useAuthStore((state) => state.user);
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0C1F3D] to-[#1E3A5F] text-white flex items-center justify-center">
			<div className="max-w-4xl w-full px-6 py-10">
				{/* HEADER */}
				<div className="text-center mb-10">
					<h1 className="text-3xl md:text-4xl font-bold mb-4">PRL Master</h1>
					<p className="text-white/80 text-lg">
						Formación en Prevención de Riesgos Laborales
					</p>
				</div>

				{/* MENSAJE PRINCIPAL */}
				<div className="bg-white/5 backdrop-blur rounded-xl p-6 mb-8 border border-white/10">
					<h2 className="text-xl font-semibold mb-4 text-[#FFD60A]">
						La seguridad no es una opción, es una responsabilidad
					</h2>

					<p className="text-white/80 mb-4">
						El conocimiento en prevención de riesgos laborales salva vidas,
						reduce accidentes y mejora el entorno de trabajo.
					</p>

					<p className="text-white/60 text-sm">
						Aprende, evalúa tus conocimientos y certifícate en PRL con una
						plataforma diseñada para profesionales y empresas.
					</p>
				</div>

				{/* ACCIONES */}
				{!user && (
					<div className="grid md:grid-cols-3 gap-4 mb-8">
						<button
							onClick={onLogin}
							className="bg-[#0C1F3D] border border-white/20 hover:bg-[#162b52] transition p-4 rounded-lg"
						>
							<div className="text-lg font-semibold mb-1">Iniciar sesión</div>
							<div className="text-sm text-white/70">
								Accede a tu progreso y certificaciones
							</div>
						</button>

						<button
							onClick={onRegister}
							className="bg-[#B8941F] hover:bg-[#a3831b] transition p-4 rounded-lg text-black"
						>
							<div className="text-lg font-semibold mb-1">Registrarse</div>
							<div className="text-sm text-black/80">
								Crea tu cuenta y empieza a formarte
							</div>
						</button>

						<button
							onClick={onGuest}
							className="bg-white/10 hover:bg-white/20 transition p-4 rounded-lg border border-white/10 text-white"
						>
							<div className="text-lg font-semibold mb-1">Entrar como demo</div>
							<div className="text-sm text-white/70">
								Explora la plataforma en modo invitado
							</div>
						</button>
					</div>
				)}

				{/* MENSAJE INFERIOR */}
				<div className="text-center text-sm text-white/50">
					Cumple con la normativa, protege a tu equipo y mejora tu entorno
					laboral.
				</div>
			</div>
		</div>
	);
}
