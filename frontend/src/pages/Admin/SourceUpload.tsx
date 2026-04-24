// Extiende la interfaz Window para incluir refreshSources
declare global {
  interface Window {
    refreshSources?: () => void;
  }
}

import React, { useRef, useState } from "react";
import { TbFileUpload, TbSparkles } from "react-icons/tb";
import { supabase } from "../../shared/lib/supabase";

const SourceUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [iaResult, setIaResult] = useState<any>(null);
  const [rawText, setRawText] = useState("");
  const [textPreview, setTextPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [sourceName, setSourceName] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setTextPreview("");
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (!selectedFile.type.includes("pdf") && !selectedFile.type.includes("json")) {
        setError("Solo se permiten archivos PDF o JSON.");
        setFile(null);
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("El archivo supera el límite de 20MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setType(selectedFile.type.includes("pdf") ? "pdf" : "json");

      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result;
        if (typeof content === "string") {
          setTextPreview(content.slice(0, 1000));
        }
      };

      if (selectedFile.type.includes("pdf")) {
        setTextPreview("Vista previa no disponible para PDF. Se extraerá el texto tras subir.");
      } else {
        reader.readAsText(selectedFile);
      }
    }
  };

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
      const res = await fetch(`${getApiBase()}/api/process-source`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setIaResult(data.ia);
        setTextPreview(data.text?.slice(0, 1000) || "");
        setStatus("¡Fuente subida y procesada!");
        if (typeof window.refreshSources === "function") window.refreshSources();
      } else {
        setError(data.error || "Error procesando la fuente");
        setStatus("");
      }
    } catch {
      setError("Error de red o de servidor");
      setStatus("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await supabase.from("sources").insert([
        {
          name: sourceName || (file ? file.name : "Fuente sin nombre"),
          type: file ? type : "text",
          content: rawText,
          uploaded_by: "admin",
          created_at: new Date().toISOString(),
          ia_result: iaResult?.text || rawText,
        },
      ]);
      setStatus("¡Fuente guardada!");
    } catch {
      setError("Error guardando la fuente en la base de datos.");
    }
    setSaving(false);
    setStatus("¡Fuente guardada!");
    setFile(null);
    setRawText("");
    setIaResult(null);
    setSourceName("");
    setCategories([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const getApiBase = () => import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <TbFileUpload size={20} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Agregar nueva fuente</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Carga PDF/JSON o pega texto para generar contenido evaluable con IA.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Archivo</span>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/json"
            onChange={handleFileChange}
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold hover:file:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200 dark:file:bg-slate-800"
            disabled={saving}
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Texto manual</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
            rows={4}
            placeholder="Pega aquí el texto si no tienes archivo"
            value={rawText}
            onChange={(event) => setRawText(event.target.value)}
            disabled={saving}
          />
        </label>
      </div>

      {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {file && <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Archivo seleccionado: <strong>{file.name}</strong> ({type.toUpperCase()})</p>}

      {textPreview && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800/70">
          <strong className="mb-1 block text-slate-700 dark:text-slate-200">Vista previa:</strong>
          <div className="max-h-40 overflow-y-auto whitespace-pre-wrap text-slate-600 dark:text-slate-300">{textPreview}</div>
        </div>
      )}

      <button
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleUpload}
        disabled={(!file && !rawText) || saving || status === "Procesando..."}
      >
        <TbSparkles size={16} />
        {status === "Procesando..." ? "Procesando..." : "Subir y procesar"}
      </button>

      {status && <p className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">{status}</p>}

      {iaResult && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-700 dark:bg-slate-800/70">
          <strong className="mb-3 block text-sm text-slate-800 dark:text-slate-100">Metadatos de la fuente</strong>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nombre</span>
              <input
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                value={sourceName}
                onChange={(event) => setSourceName(event.target.value)}
                placeholder="Ej: Normativa PRL 2024"
                disabled={saving}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Categorías</span>
              <input
                className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                value={categories.join(", ")}
                onChange={(event) => setCategories(event.target.value.split(",").map((category) => category.trim()))}
                placeholder="Normativa, Riesgos, Evaluación"
                disabled={saving}
              />
            </label>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">Ver JSON IA completo</summary>
            <pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap text-[11px]">{JSON.stringify(iaResult, null, 2)}</pre>
          </details>

          <button
            className="mt-4 inline-flex h-10 items-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar fuente"}
          </button>
        </div>
      )}
    </section>
  );
};

export default SourceUpload;
