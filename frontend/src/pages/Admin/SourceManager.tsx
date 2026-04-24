import React, { useEffect, useState } from "react";
import { supabase } from "../../shared/lib/supabase";
import QuizPlayer from "../../components/QuizPlayer";

interface Source {
  id: string;
  name: string;
  type: string;
  content: string;
  ia_result: any;
  created_at: string;
}

const SourceManager: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<any>(null);

  const fetchSources = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setSources(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este archivo?")) return;
    setDeleting(id);
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (error) setError(error.message);
    else setSources((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  useEffect(() => {
    fetchSources();
    // Permitir refresco global desde SourceUpload
    window.refreshSources = fetchSources;
    return () => { delete window.refreshSources; };
  }, []);

  const normalizeQuiz = (data: any) => {
  if (Array.isArray(data)) return data[0];
  return data;
};

  return (
    <div>
      <h2>Archivos Ingeridos</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!activeQuiz && (
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((src) => (
            <tr key={src.id}>
              <td>{src.name}</td>
              <td>{src.type}</td>
              <td>{new Date(src.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(src.id)} disabled={deleting === src.id}>
                  {deleting === src.id ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  onClick={() => {
                    const quiz = normalizeQuiz(src.ia_result);
                    setActiveQuiz(quiz);
                  }}
                >
                  Iniciar Quiz
                </button>
                <details>
                  <summary>Ver contenido</summary>
                  <pre style={{ maxWidth: 400, maxHeight: 200, overflow: "auto" }}>{src.content}</pre>
                  {src.ia_result && (
                    <>
                      <strong>Resultado IA:</strong>
                      <pre style={{ maxWidth: 400, maxHeight: 200, overflow: "auto" }}>{JSON.stringify(src.ia_result, null, 2)}</pre>
                    </>
                  )}                  
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      {activeQuiz && (
        <div>
          <h3>Quiz Activo</h3>
          <QuizPlayer quiz={activeQuiz} />
          <button onClick={() => setActiveQuiz(null)}>
            Cerrar Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default SourceManager;
