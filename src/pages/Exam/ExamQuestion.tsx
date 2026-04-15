import { useState } from "react";
import type { Question } from "../../types";

interface Props {
	question: Question;
	onAnswer: (i: number) => void;
}

export default function ExamQuestion({ question, onAnswer }: Props) {
	const [selected, setSelected] = useState<number | null>(null);
	const [showResult, setShowResult] = useState(false);

	const handleSelect = (i: number) => {
		if (showResult) return;
		setSelected(i);
		setShowResult(true);
		setTimeout(() => {
			onAnswer(i);
			setSelected(null);
			setShowResult(false);
		}, 900);
	};

	return (
		<div className="bg-white p-4 rounded shadow">
			<h3 className="font-medium mb-4">{question.q}</h3>

			{question.ops.map((op, i) => {
				let optClass = "opt";
				let badge = null;
				if (showResult) {
					if (i === question.r) {
						optClass += " ok border-green-700 bg-green-50 text-green-700";
						badge = <span className="badge badge-pass ml-2">Correcta</span>;
					} else if (selected === i) {
						optClass += " err border-red-700 bg-red-50 text-red-700";
						badge = <span className="badge badge-fail ml-2">Incorrecta</span>;
					}
				} else if (selected === i) {
					optClass += " sel border-blue-700 bg-blue-50";
				}
				return (
					<div
						key={i}
						onClick={() => handleSelect(i)}
						className={optClass + " mb-2"}
						style={{ pointerEvents: showResult ? "none" : "auto" }}
					>
						<span className="opt-l">{String.fromCharCode(65 + i)}</span>
						<span>{op}</span>
						{badge}
					</div>
				);
			})}
		</div>
	);
}
