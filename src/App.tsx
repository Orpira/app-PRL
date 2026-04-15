import { useState } from "react";
import Layout from "./components/Layout";
import Chat from "./pages/Chat";
import Stats from "./pages/Stats";

import Home from "./pages/Home";
import StudyIndex from "./pages/Study/StudyIndex";
import StudyCategory from "./pages/Study/StudyCategory";
import StudyPractice from "./pages/Study/StudyPractice";
import { QUESTIONS } from "./data/questions";

import ExamSetup from "./pages/Exam/ExamSetup";
import ExamQuestion from "./pages/Exam/ExamQuestion";
import ExamResult from "./pages/Exam/ExamResult";

import useExam from "./hooks/useExam";

export default function App() {
	const [view, setView] = useState("home");
	const [studyCat, setStudyCat] = useState<string | null>(null);
	const [practiceQs, setPracticeQs] = useState<any[]>([]);
	const [examQs, setExamQs] = useState<any[]>([]);

	const exam = useExam(examQs);

	return (
		<Layout view={view} setView={setView}>
			{view === "home" && <Home />}

			{view === "study" && !studyCat && <StudyIndex onSelect={setStudyCat} />}

			{view === "study" && studyCat && practiceQs.length === 0 && (
				<StudyCategory
					cat={studyCat}
					onPractice={() => {
						const qs = QUESTIONS.filter((q) => q.cat === studyCat);
						setPracticeQs(qs);
					}}
					onBack={() => setStudyCat(null)}
				/>
			)}

			{view === "study" && studyCat && practiceQs.length > 0 && (
				<StudyPractice
					questions={practiceQs}
					onFinish={() => setPracticeQs([])}
				/>
			)}

			{view === "exam" && examQs.length === 0 && (
				<ExamSetup onStart={setExamQs} />
			)}

			{view === "exam" && examQs.length > 0 && !exam.done && (
				<ExamQuestion question={exam.current} onAnswer={exam.answer} />
			)}

			{view === "exam" && exam.done && <ExamResult result={exam.getResult()} />}

			{view === "chat" && <Chat />}
			{view === "stats" && <Stats />}
		</Layout>
	);
}
