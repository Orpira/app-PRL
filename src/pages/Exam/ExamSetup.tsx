import { QUESTIONS } from "../../data/questions";

export default function ExamSetup({
	onStart,
}: {
	onStart: (qs: any[]) => void;
}) {
	const start = () => {
		const shuffled = [...QUESTIONS]
			.sort(() => Math.random() - 0.5)
			.slice(0, 20);

		onStart(shuffled);
	};

	return (
		<div>
			<h2 className="mb-4">Configurar Examen</h2>

			<button
				onClick={start}
				className="bg-[#B8941F] text-white px-4 py-2 rounded"
			>
				Iniciar examen
			</button>
		</div>
	);
}
