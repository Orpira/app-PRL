import { useState, useEffect } from "react";
import { supabase } from "./shared/lib/supabase";
import Sidebar from "./components/Sidebar";
import { AppContext } from "./context/AppContext";
import Chat from "./pages/Chat";
import Stats from "./pages/Stats";
import Welcome from "./pages/Welcome";
import { useAuthStore } from "./store/useAuthStore";
import { QUESTIONS } from "./data/questions";
import Home from "./pages/Home";
import StudyIndex from "./pages/Study/StudyIndex";
import StudyCategory from "./pages/Study/StudyCategory";
import StudyPractice from "./pages/Study/StudyPractice";
import ExamSetup from "./pages/Exam/ExamSetup";
import ExamNavigator from "./pages/Exam/ExamNavigator";
import ExamResult from "./pages/Exam/ExamResult";
import { saveResult } from "./store/saveResult";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

export default function App() {
	const [view, setView] = useState("welcome");
	const [studyCat, setStudyCat] = useState<string | null>(null);
	const [practiceQs, setPracticeQs] = useState<any[]>([]);
	const [examStep, setExamStep] = useState<"setup" | "exam" | "result">(
		"setup",
	);
	const [examQuestions, setExamQuestions] = useState<any[]>([]);
	const [examAnswers, setExamAnswers] = useState<(number | null)[]>([]);
	const [examUserName, setExamUserName] = useState("");
	const user = useAuthStore((state) => state.user);
	const [loginMessage, setLoginMessage] = useState<string | null>(null);
	const login = useAuthStore((state) => state.login);
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginLoading, setLoginLoading] = useState(false);
	const [examError, setExamError] = useState<string | null>(null);
	const setUser = useAuthStore((state) => state.setUser);

	// Restaurar sesión al montar la app
	useEffect(() => {
		supabase.auth.getUser().then(({ data, error }) => {
			if (data?.user) {
				setUser(data.user);
				// Si la vista es welcome, login o register, ir a home
				if (["welcome", "login", "register"].includes(view)) {
					setView("home");
				}
			}
		});
	}, [setUser]);

	const goToLogin = () => {
		setLoginMessage(null);
		setView("login");
	};
	const goToWelcome = () => {
		setLoginMessage(null);
		setView("welcome");
	};
	const goToHome = () => {
		setLoginMessage(null);
		setView("home");
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoginLoading(true);
		setLoginMessage(null);
		try {
			await login(loginEmail, loginPassword);
			setLoginEmail("");
			setLoginPassword("");
			setView("home");
		} catch (err: any) {
			setLoginMessage("Error de autenticación. Verifica tus datos.");
		} finally {
			setLoginLoading(false);
		}
	};

	// Exponer setters globales para limpiar al cerrar sesión
	window.setPracticeQsGlobal = setPracticeQs;
	window.setStudyCatGlobal = setStudyCat;

	// Sincronizar practiceQs con window para modo demo
	useEffect(() => {
		window.practiceQsGlobal = practiceQs;
		window.dispatchEvent(new Event("practiceQsChange"));
	}, [practiceQs]);

	// Limpiar preguntas y categoría al entrar en modo demo
	useEffect(() => {
		if (!user && view === "study") {
			setPracticeQs([]);
			setStudyCat(null);
		}
	}, [user, view]);

	return (
		<AppContext.Provider value={{ setView, setLoginMessage }}>
			{/* Navbar visible solo si hay usuario autenticado */}
			<Navbar />
			{/* Flujo de bienvenida, login, registro y explorar */}
			{view === "welcome" && (
				<Welcome
					onLogin={goToLogin}
					onRegister={() => setView("register")}
					onGuest={goToHome}
				/>
			)}
			{view === "login" && <Login />}
			{view === "register" && <Register />}
			{/* App principal */}
			{view !== "welcome" && view !== "login" && view !== "register" && (
				<div className="flex h-screen">
					{/* Sidebar solo para usuarios autenticados */}
					{user && <Sidebar view={view} setView={setView} />}
					<main className="main">
						{view === "home" && <Home />}
						{/* Modo explorar: solo 4 temas y sin IA */}
						{view === "study" && !user && (
							<StudyIndex
								onSelect={setStudyCat}
								limit={4}
								studyCat={studyCat}
							/>
						)}
						{view === "study" && user && !studyCat && (
							<StudyIndex onSelect={setStudyCat} studyCat={studyCat} />
						)}
						{view === "study" && studyCat && practiceQs.length === 0 && (
							<StudyCategory
								cat={studyCat}
								onPractice={() => {
									const allQs = QUESTIONS.filter((q) => q.cat === studyCat);
									const qs = !user ? allQs.slice(0, 5) : allQs;
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
						{/* Solo un examen permitido en modo explorar */}
						{view === "exam" && (
							<div className="max-w-3xl mx-auto mt-8">
								{examStep === "setup" && (
									<ExamSetup
										onStart={({ name, questions }) => {
											if (!user && localStorage.getItem("explore_exam_done")) {
												setLoginMessage(
													"Solo puedes realizar un examen en modo explorar. Regístrate para más.",
												);
												setView("login");
												return;
											}
											setExamUserName(name);
											setExamQuestions(questions);
											setExamStep("exam");
										}}
									/>
								)}
								{examStep === "exam" && (
									<ExamNavigator
										questions={examQuestions}
										onFinish={async (ans) => {
											const ok = examQuestions.reduce(
												(acc, q, i) => acc + (ans[i] === q.r ? 1 : 0),
												0,
											);
											const total = examQuestions.length;
											const pct = Math.round((ok / total) * 100);
											const passed = pct >= 60;
											setExamError(null);
											try {
												await saveResult({ ok, total, pct, passed }, user?.id);
											} catch (err: any) {
												setExamError(
													"Error al guardar el resultado. Intenta de nuevo o contacta soporte. " +
														(err?.message || ""),
												);
												return;
											}
											setExamAnswers(ans);
											setExamStep("result");
											if (!user) localStorage.setItem("explore_exam_done", "1");
										}}
										duration={examQuestions.length * 90}
									/>
								)}
								{examStep === "result" && (
									<ExamResult
										questions={examQuestions}
										answers={examAnswers}
										userName={examUserName}
										onRetry={(name, numQuestions) => {
											if (!user) {
												setLoginMessage(
													"Solo puedes realizar un examen en modo explorar. Regístrate para más.",
												);
												setView("login");
												return;
											}
											const shuffled = [...QUESTIONS]
												.sort(() => Math.random() - 0.5)
												.slice(0, numQuestions);
											setExamUserName(name);
											setExamQuestions(shuffled);
											setExamAnswers([]);
											setExamStep("exam");
										}}
									/>
								)}
							</div>
						)}
						{/* Asistente IA solo para usuarios autenticados */}
						{view === "chat" && user && <Chat />}
						{view === "stats" && <Stats />}
					</main>
				</div>
			)}
			{/* Footer profesional */}
			<Footer />
		</AppContext.Provider>
	);
}
