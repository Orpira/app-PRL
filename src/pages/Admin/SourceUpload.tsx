import React, { useRef, useState } from "react";
import { supabase } from "../../shared/lib/supabase";

const SourceUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [iaResult, setIaResult] = useState<any>(null);
  const [rawText, setRawText] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceName, setSourceName] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setType(e.target.files[0].type.includes("pdf") ? "pdf" : "json");
    }
  };

  const handleUpload = async () => {
    setStatus("");
    setIaResult(null);
    if (!file && !rawText) return;
    setStatus("Procesando...");
    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        formData.append("type", type);
      } else if (rawText) {
        formData.append("type", "text");
        formData.append("rawText", rawText);
      }
      const res = await fetch(`${getApiBase()}/api/ia/process-source`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setIaResult(data.ia);
        setStatus("¡Fuente subida y procesada!");
      } else {
        setStatus(data.error || "Error procesando la fuente");
      }
    } catch (err) {
      setStatus("Error de red o de servidor");
    }
  };

  React.useEffect(() => {
    if (iaResult && iaResult.choices) {
      try {
        // Intentar extraer categorías del JSON IA
        const content = iaResult.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          setCategories(Object.keys(parsed));
        }
      } catch {}
    }
  }, [iaResult]);

  const handleSave = async () => {
    setSaving(true);
    // Guardar en Supabase (tabla sources)
    await supabase.from("sources").insert([
      {
        name: sourceName || (file ? file.name : "Fuente sin nombre"),
        type: file ? type : "text",
        categories,
        uploaded_by: "admin", // Aquí puedes usar el id del usuario logueado
        created_at: new Date().toISOString(),
        file_url: null, // Si implementas almacenamiento de archivos
        text: iaResult?.text || rawText,
      },
    ]);
    setSaving(false);
    setStatus("¡Fuente guardada!");
    setFile(null);
    setRawText("");
    setIaResult(null);
    setSourceName("");
    setCategories([]);
  };

  // Utilidad para obtener la URL base del backend
  const getApiBase = () => {
    // Si está en Codespaces, usar la URL pública
    if (window.location.hostname.endsWith("github.dev")) {
      return "https://obscure-chainsaw-x55gx67pjpw5f66jr.github.dev";
    }
    // Si está en local, usar localhost:3001
    return "http://localhost:3001";
  };

  return (
    <div className="mb-8 p-4 border rounded bg-gray-50">
      <h2 className="font-semibold mb-2">Agregar nueva fuente</h2>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/json"
        onChange={handleFileChange}
        className="mb-2"
      />
      <div className="mb-2 text-sm text-gray-700">O pega texto manualmente:</div>
      <textarea
        className="w-full border rounded px-2 py-1 mb-2"
        rows={3}
        placeholder="Pega aquí el texto si no tienes archivo"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      {file && (
        <div className="mb-2 text-sm text-gray-700">
          Archivo: <b>{file.name}</b> ({type.toUpperCase()})
        </div>
      )}
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={!file && !rawText}
      >
        Subir y procesar
      </button>
      {status && <div className="mt-2 text-green-700">{status}</div>}
      {iaResult && (
        <div className="mt-4 p-3 bg-gray-100 border rounded text-xs overflow-x-auto">
          <b>Vista previa IA:</b>
          <div className="mb-2">
            <label className="block text-sm font-medium">Nombre de la fuente:</label>
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              value={sourceName}
              onChange={e => setSourceName(e.target.value)}
              placeholder="Ej: Normativa PRL 2024"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Categorías detectadas (puedes editar):</label>
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              value={categories.join(", ")}
              onChange={e => setCategories(e.target.value.split(",").map(c => c.trim()))}
              placeholder="Ej: Normativa, Riesgos, Evaluación"
            />
          </div>
          <details>
            <summary className="cursor-pointer">Ver JSON IA completo</summary>
            <pre>{JSON.stringify(iaResult, null, 2)}</pre>
          </details>
          <button
            className="mt-2 bg-green-700 text-white px-4 py-2 rounded"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar fuente"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SourceUpload;
