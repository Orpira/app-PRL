import { useState } from "react";

export default function QuizPlayer({ quiz }: any) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  console.log("QUIZ EN PLAYER:", quiz);

  // 🔥 VALIDACIONES CORRECTAS
  if (!quiz) return <p>Cargando...</p>;

  if (quiz.fallback) {
    return <p>No se pudo generar un quiz válido</p>;
  }

  if (!Array.isArray(quiz.questions)) {
    return <p>Estructura inválida</p>;
  }

  if (quiz.questions.length === 0) {
    return <p>No hay preguntas disponibles</p>;
  }

  const question = quiz.questions[current];

  if (!question) {
    return (
      <div>
        <h2>Resultado</h2>
        <p>Puntuación: {score} / {quiz.questions.length}</p>
      </div>
    );
  }

  const handleSelect = (option: string) => {
    setSelected(option);
    setShowAnswer(true);

    if (option === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((c) => c + 1);
  };

  return (
    <div>
      <h3>{quiz.title || "Quiz"}</h3>

      <p>
        Pregunta {current + 1} / {quiz.questions.length}
      </p>

      <h4>{question.question}</h4>

      {question.options?.map((opt: string, i: number) => (
        <button
          key={i}
          onClick={() => handleSelect(opt)}
          disabled={showAnswer}
          style={{
            display: "block",
            margin: "8px 0",
            background:
              showAnswer && opt === question.answer
                ? "green"
                : showAnswer && opt === selected
                ? "red"
                : "",
          }}
        >
          {opt}
        </button>
      ))}

      {showAnswer && (
        <>
          <p>{question.explanation}</p>
          <button onClick={next}>Siguiente</button>
        </>
      )}
    </div>
  );
}