	// ...existing code...
import { useState, useEffect } from "react";
// Botón flotante para subir arriba
function ScrollToTopButton() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setVisible(window.scrollY > 200);
		};
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	if (!visible) return null;
	return (
		<button
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="fixed bottom-6 right-6 z-50 bg-[#0C1F3D] text-white p-3 rounded-full shadow-lg hover:bg-[#1B3A6B] transition-colors"
			aria-label="Subir al inicio"
		>
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
				<path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</button>
	);
}
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
import AdminPanel from "./pages/Admin/AdminPanel";
import { AdminRouteGuard } from "./pages/Admin/routeGuard";
// import { saveResult } from "./store/saveResult"; // No usado
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
	// loginMessage eliminado porque no se usa
	// Eliminados: login, loginEmail, loginPassword, loginLoading, examError
	const setUser = useAuthStore((state) => state.setUser);

	// Restaurar sesión al montar la app

	useEffect(() => {
		supabase.auth.getUser().then(async ({ data }) => {
			if (data?.user) {
				// Consultar perfil para obtener el rol
				try {
					const { data: profile } = await supabase
						.from("profiles")
						.select("id, email, role")
						.eq("id", data.user.id)
						.single();
					if (profile) {
						setUser({ ...data.user, role: profile.role || "user" });
					} else {
						setUser({ ...data.user, role: "user" });
					}
				} catch {
					setUser({ ...data.user, role: "user" });
				}
				// Si la vista es welcome, login o register, ir a home
				if (["welcome", "login", "register"].includes(view)) {
					setView("home");
				}
			}
		});
	}, [setUser]);

	const goToLogin = () => {
		setView("login");
	};
	const goToHome = () => {
		setView("home");
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
		<AppContext.Provider value={{ setView }}>
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
											// Mensaje de login eliminado
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
										 onFinish={(ans) => {
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
									 />
								 )}
							</div>
						)}
						{/* Asistente IA solo para usuarios autenticados */}
						{view === "chat" && user && <Chat />}
						{view === "stats" && <Stats />}
						{/* Panel de administración solo para admins */}
						{view === "admin" && user?.role === "admin" && (
							<AdminRouteGuard>
								<AdminPanel />
							</AdminRouteGuard>
						)}
				</main>
				<ScrollToTopButton />
			</div>
		)}
			{/* Footer profesional */}
			<Footer />
		</AppContext.Provider>
	);
}
