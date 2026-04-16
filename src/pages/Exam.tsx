import { useState } from "react";
import ExamSetup from "./Exam/ExamSetup";
import ExamNavigator from "./Exam/ExamNavigator";
import ExamResult from "./Exam/ExamResult";
import type { Question } from "../types";

export default function ExamPage() {
	const [step, setStep] = useState<"setup" | "exam" | "result">("setup");
	const [questions, setQuestions] = useState<Question[]>([]);
	const [answers, setAnswers] = useState<(number | null)[]>([]);
	const [userName, setUserName] = useState("");

	const handleStart = (data: { name: string; questions: Question[] }) => {
		setUserName(data.name);
		setQuestions(data.questions);
		setStep("exam");
	};

	const handleFinish = (ans: (number | null)[]) => {
		setAnswers(ans);
		setStep("result");
	};

	return (
		<div className="max-w-3xl mx-auto mt-8">
			{step === "setup" && <ExamSetup onStart={handleStart} />}
			{step === "exam" && (
				<ExamNavigator
					questions={questions}
					onFinish={handleFinish}
					duration={questions.length * 90}
				/>
			)}
			{step === "result" && (
				<ExamResult
					questions={questions}
					answers={answers}
					userName={userName}
				/>
			)}
		</div>
	);
}
