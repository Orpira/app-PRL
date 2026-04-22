import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
};

export default function Quiz({ questions }: { questions: Question[] }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (option: string) => {
    if (selected) return;

    setSelected(option);

    if (option === q.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const next = () => {
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (!questions || questions.length === 0) {
    return <p>No hay preguntas</p>;
  }

  if (finished) {
    return (
      <div className="mt-6 p-4 bg-gray-900 rounded">
        <h2 className="text-xl font-bold">Resultado</h2>
        <p className="mt-2">
          Puntuación: {score} / {questions.length}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-900 rounded">
      <h2 className="text-lg font-bold mb-4">
        Pregunta {current + 1} de {questions.length}
      </h2>

      <p className="mb-4">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className={`block w-full text-left p-2 rounded border ${
              selected === opt
                ? opt === q.answer
                  ? "bg-green-600"
                  : "bg-red-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {selected && (
        <button
          onClick={next}
          className="mt-4 bg-blue-500 px-4 py-2 rounded"
        >
          Siguiente
        </button>
      )}
    </div>
  );
}