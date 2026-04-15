import { useState } from "react";
import type { Question } from "../types";

export function useAppStore() {
	const [view, setView] = useState("home");

	// study
	const [studyCat, setStudyCat] = useState<string | null>(null);

	// exam
	const [examQuestions, setExamQuestions] = useState<Question[]>([]);

	return {
		view,
		setView,
		studyCat,
		setStudyCat,
		examQuestions,
		setExamQuestions,
	};
}
