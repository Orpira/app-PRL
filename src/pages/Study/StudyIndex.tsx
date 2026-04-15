import { QUESTIONS } from "../../data/questions";

const CATS = [...new Set(QUESTIONS.map((q) => q.cat))];

export default function StudyIndex({
	onSelect,
}: {
	onSelect: (cat: string) => void;
}) {
	return (
		<div className="page">
			<h2 className="page-title mb-4">Modo Estudio</h2>
			<div className="grid4">
				{CATS.map((cat) => (
					<div key={cat} onClick={() => onSelect(cat)} className="cat-card">
						{cat}
					</div>
				))}
			</div>
		</div>
	);
}
