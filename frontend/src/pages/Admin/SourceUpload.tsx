import React, { useRef, useState } from "react";
import { supabase } from "../../shared/lib/supabase";

const SourceUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [iaResult, setIaResult] = useState<any>(null);
  const [rawText, setRawText] = useState("");
  const [textPreview, setTextPreview] = useState<string>("");
  const [error, setError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setTextPreview("");
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.type.includes("pdf") && !f.type.includes("json")) {
        setError("Solo se permiten archivos PDF o JSON.");
        setFile(null);
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        setError("El archivo supera el límite de 20MB.");
        setFile(null);
        return;
      }
      setFile(f);
      setType(f.type.includes("pdf") ? "pdf" : "json");
      // Vista previa básica
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result;
        if (typeof content === "string") {
          setTextPreview(content.slice(0, 1000));
        }
      };
      if (f.type.includes("pdf")) {
        setTextPreview("Vista previa no disponible para PDF. Se extraerá el texto tras subir.");
      } else {
        reader.readAsText(f);
      }
    }
  };

  // Recibe una prop opcional para refrescar la lista tras subir
  const handleUpload = async () => {
    setStatus("");
    setError("");
    setIaResult(null);
    if (!file && !rawText) {
      setError("Debes seleccionar un archivo o ingresar texto.");
      return;
    }
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
        setTextPreview(data.text?.slice(0, 1000) || "");
        setStatus("¡Fuente subida y procesada!");
        // Refrescar lista si se pasa prop
        if (typeof window.refreshSources === "function") window.refreshSources();
      } else {
        setError(data.error || "Error procesando la fuente");
        setStatus("");
      }
    } catch (err) {
      setError("Error de red o de servidor");
      setStatus("");
    }
  };

  // Eliminar lógica de categorías, solo mostrar IA si existe

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
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
      setStatus("¡Fuente guardada!");
    } catch (e) {
      setError("Error guardando la fuente en la base de datos.");
    }
    setSaving(false);
    setStatus("¡Fuente guardada!");
    setFile(null);
    setRawText("");
    setIaResult(null);
    setSourceName("");
    setCategories([]);
  };

  // Utilidad para obtener la URL base del backend
  // Siempre usar la ruta relativa para que el proxy de Vite gestione la redirección
  const getApiBase = () => {
    return import.meta.env.VITE_API_URL || "http://localhost:3001/api";
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
        disabled={saving}
      />
      <div className="mb-2 text-sm text-gray-700">O pega texto manualmente:</div>
      <textarea
        className="w-full border rounded px-2 py-1 mb-2"
        rows={3}
        placeholder="Pega aquí el texto si no tienes archivo"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        disabled={saving}
      />
      {error && <div className="mb-2 text-red-700">{error}</div>}
      {file && (
        <div className="mb-2 text-sm text-gray-700">
          Archivo: <b>{file.name}</b> ({type.toUpperCase()})
        </div>
      )}
      {textPreview && (
        <div className="mb-2 text-xs bg-gray-100 border rounded p-2">
          <b>Vista previa del texto extraído:</b>
          <div className="whitespace-pre-wrap max-h-40 overflow-y-auto">{textPreview}</div>
        </div>
      )}
      <button
        className="bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={(!file && !rawText) || saving || status === "Procesando..."}
      >
        {status === "Procesando..." ? "Procesando..." : "Subir y procesar"}
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
              disabled={saving}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Categorías detectadas (puedes editar):</label>
            <input
              className="border rounded px-2 py-1 w-full mb-2"
              value={categories.join(", ")}
              onChange={e => setCategories(e.target.value.split(",").map(c => c.trim()))}
              placeholder="Ej: Normativa, Riesgos, Evaluación"
              disabled={saving}
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
