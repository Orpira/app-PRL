import Card from "../components/Card";
import { QUESTIONS } from "../data/questions";

export default function Home() {
	return (
		<div className="page">
			<h1 className="page-title mb-4">Panel Principal</h1>
			<div className="grid4 mb-4">
				<Card>
					<div className="stat-num">{QUESTIONS.length}</div>
					<div className="stat-label">Preguntas</div>
				</Card>
			</div>
			<Card>
				<h3 className="mb-2 font-medium">Accesos rápidos</h3>
				<div className="flex flex-col gap-2">
					<button className="btn btn-primary">Estudiar</button>
					<button className="btn btn-gold">Examen</button>
				</div>
			</Card>
		</div>
	);
}
