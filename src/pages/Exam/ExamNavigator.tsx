import { useState, useEffect } from "react";
import ExamQuestion from "./ExamQuestion";
import Button from "../../components/Button";
import ProgressBar from "../../components/ProgressBar";

import type { Question } from "../../types";

interface ExamNavigatorProps {
	questions: Question[];
	onFinish: (answers: (number | null)[]) => void;
	duration: number; // en segundos
}

export default function ExamNavigator({
	questions,
	onFinish,
	duration,
}: ExamNavigatorProps) {
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<(number | null)[]>(
		Array(questions.length).fill(null),
	);
	// Estado para la respuesta seleccionada en la pregunta actual
	const [selected, setSelected] = useState<number | null>(null);
	const [showWarning, setShowWarning] = useState(false);
	const [timeLeft, setTimeLeft] = useState(duration);

	// Temporizador funcional
	useEffect(() => {
		if (timeLeft <= 0) {
			onFinish(answers);
			return;
		}
		const timer = setInterval(() => {
			setTimeLeft((t) => t - 1);
		}, 1000);
		return () => clearInterval(timer);
		// eslint-disable-next-line
	}, [timeLeft]);

	const handleAnswer = (answerIdx: number) => {
		setSelected(answerIdx);
		setShowWarning(false);
	};

	const handleNext = () => {
		if (selected !== null) {
			const updated = [...answers];
			updated[current] = selected;
			setAnswers(updated);
			setSelected(null);
			if (current < questions.length - 1) {
				setCurrent(current + 1);
			}
		}
	};

	const handlePrev = () => {
		if (current > 0) {
			setCurrent(current - 1);
			// Restaurar selección previa si existe
			setSelected(answers[current - 1]);
		}
	};

	const handleFinish = () => {
		// Guarda la respuesta seleccionada antes de finalizar
		let updated = [...answers];
		if (selected !== null) {
			updated[current] = selected;
		}
		if (updated.includes(null)) {
			setShowWarning(true);
			return;
		}
		onFinish(updated);
	};

	return (
		<div className="p-4">
			<div className="flex justify-between items-center mb-2">
				<span>
					Pregunta {current + 1} de {questions.length}
				</span>
				<span>
					Tiempo: {Math.floor(timeLeft / 60)}:
					{(timeLeft % 60).toString().padStart(2, "0")}
				</span>
				<button className="text-sm underline" onClick={handleFinish}>
					Finalizar
				</button>
			</div>
			<ProgressBar value={current + 1} max={questions.length} />
			<div className="my-4">
				<ExamQuestion
					question={questions[current]}
					selected={selected}
					setSelected={setSelected}
					onAnswer={handleAnswer}
				/>
			</div>
			<div className="flex justify-between items-center mt-4">
				<Button onClick={handlePrev} disabled={current === 0}>
					Anterior
				</Button>
				<span className="text-sm">
					{answers.filter((a) => a !== null).length}/{questions.length}{" "}
					respondidas
				</span>
				{current < questions.length - 1 ? (
					<Button onClick={handleNext} disabled={selected === null}>
						Siguiente
					</Button>
				) : (
					<Button
						onClick={handleFinish}
						disabled={selected === null && answers[current] === null}
					>
						Finalizar
					</Button>
				)}
			</div>
			{showWarning && (
				<div className="mt-4 text-yellow-700 bg-yellow-100 p-2 rounded">
					Tienes preguntas sin responder. Puedes volver a ellas antes de
					finalizar.
				</div>
			)}
		</div>
	);
}
