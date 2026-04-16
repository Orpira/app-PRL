import type { Question } from "../../types";

interface Props {
	question: Question;
	selected: number | null;
	setSelected: (i: number) => void;
	onAnswer: (i: number) => void;
}

export default function ExamQuestion({
	question,
	selected,
	setSelected,
	onAnswer,
}: Props) {
	const handleSelect = (i: number) => {
		setSelected(i);
		onAnswer(i);
	};

	return (
		<div className="bg-white p-4 rounded shadow">
			<h3 className="font-medium mb-4">{question.q}</h3>
			{question.ops.map((op, i) => {
				let optClass = "opt";
				if (selected === i) {
					optClass += " sel border-blue-700 bg-blue-50";
				}
				return (
					<div
						key={i}
						onClick={() => handleSelect(i)}
						className={optClass + " mb-2"}
						style={{ pointerEvents: false }}
					>
						<span className="opt-l">{String.fromCharCode(65 + i)}</span>
						<span>{op}</span>
					</div>
				);
			})}
		</div>
	);
}
