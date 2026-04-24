import { useState } from "react";
import Quiz from "./components/QuizPlayer";

export default function SourceUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState("");
  const [type, setType] = useState<"pdf" | "json" | "text">("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);

      if (selected.type === "application/pdf") setType("pdf");
      else if (selected.type === "application/json") setType("json");
      else setType("text");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let response;

      if (type === "text") {
        // envío JSON
        response = await fetch("/api/process-source", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "text",
            rawText: "contenido...",
          }),
        });
      } else {
        // envío archivo
        const formData = new FormData();
        if (file) formData.append("file", file);
        formData.append("type", type);

        response = await fetch("/api/process-source", {
          method: "POST",
          body: formData,
        });
        if (window.refreshSources) {
          window.refreshSources();
      }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error procesando la fuente");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Subir fuente</h2>

      {/* Selector */}
      <div className="mb-4">
        <label className="block mb-2">Tipo de entrada:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          className="w-full p-2 rounded bg-gray-800"
        >
          <option value="text">Texto manual</option>
          <option value="pdf">PDF</option>
          <option value="json">JSON</option>
        </select>
      </div>

      {/* Input texto */}
      {type === "text" && (
        <textarea
          placeholder="Pega aquí el contenido..."
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full h-40 p-3 rounded bg-gray-800 mb-4"
        />
      )}

      {/* Input archivo */}
      {type !== "text" && (
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />
      )}

      {/* Botón */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        {loading ? "Procesando..." : "Procesar fuente"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 text-red-400">
          ❌ {error}
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="mt-6 bg-gray-900 p-4 rounded overflow-auto max-h-[400px]">
          <h3 className="font-bold mb-2">Resultado:</h3>
          <pre className="text-sm">
            {/*JSON.stringify(result, null, 2)*/}
          </pre>
        </div>
      )}
      {result?.structured?.questions && (
         <Quiz questions={result.structured.questions} />
    )}
    </div>
  );
}