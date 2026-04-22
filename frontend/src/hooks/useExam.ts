import { useState } from "react";
import type { Question } from "../types";

export default function useExam(questions: Question[]) {
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState<(number | null)[]>(
		new Array(questions.length).fill(null),
	);
	const [done, setDone] = useState(false);

	const current = questions[index];

	const answer = (i: number) => {
		const newAnswers = [...answers];
		newAnswers[index] = i;
		setAnswers(newAnswers);
	};

	const next = () => {
		if (index < questions.length - 1) {
			setIndex(index + 1);
		} else {
			setDone(true);
		}
	};

	const getResult = () => {
		let ok = 0;
		questions.forEach((q, i) => {
			if (answers[i] === q.r) ok++;
		});

		const pct = Math.round((ok / questions.length) * 100);

		return {
			ok,
			tot: questions.length,
			pct,
			p: pct >= 60,
		};
	};

	return {
		current,
		index,
		answers,
		answer,
		next,
		done,
		getResult,
	};
}
