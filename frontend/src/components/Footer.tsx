export default function Footer() {
	return (
		<footer className="w-full bg-gray-900 text-gray-200 py-6 mt-auto shadow-inner">
			<div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4">
				<div className="text-sm text-center md:text-left">
					© {new Date().getFullYear()} PRL App · Plataforma de formación en
					Prevención de Riesgos Laborales
				</div>
				<div className="flex flex-wrap gap-4 justify-center md:justify-end">
					<a
						href="https://www.insst.es/"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-white underline transition"
					>
						INSST (Instituto Nacional de Seguridad y Salud en el Trabajo)
					</a>
					<a
						href="https://osha.europa.eu/es"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-white underline transition"
					>
						EU-OSHA (Agencia Europea para la Seguridad y la Salud en el Trabajo)
					</a>
					<a
						href="https://www.boe.es/buscar/act.php?id=BOE-A-1995-7730"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-white underline transition"
					>
						Ley 31/1995 PRL (BOE)
					</a>
				</div>
			</div>
		</footer>
	);
}
