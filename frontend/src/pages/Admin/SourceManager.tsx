import React, { useEffect, useState } from "react";
import { TbBolt, TbClock, TbFileDescription, TbTrash } from "react-icons/tb";
import QuizPlayer from "../../components/QuizPlayer";
import { supabase } from "../../shared/lib/supabase";

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
    const { data, error } = await supabase.from("sources").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setSources(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este archivo?")) return;
    setDeleting(id);
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (error) setError(error.message);
    else setSources((prev) => prev.filter((source) => source.id !== id));
    setDeleting(null);
  };

  useEffect(() => {
    fetchSources();
    window.refreshSources = fetchSources;
    return () => {
      delete window.refreshSources;
    };
  }, []);

  const normalizeQuiz = (data: any) => {
    if (Array.isArray(data)) return data[0];
    return data;
  };

  if (error) return <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Fuentes y quizzes</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Revisa cada recurso con tarjetas ligeras y ejecuta tests en un clic.</p>
        </div>
      </div>

      {!activeQuiz && (
        <>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-44 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="skeleton-title" />
                  <div className="skeleton-text" />
                  <div className="mt-8 flex gap-2">
                    <div className="skeleton h-9 w-24" />
                    <div className="skeleton h-9 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sources.map((source) => (
                <article
                  key={source.id}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <TbFileDescription size={14} />
                        {source.type}
                      </p>
                      <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-slate-100">{source.name}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <TbClock size={14} />
                      {new Date(source.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{source.content || "Sin vista previa disponible."}</p>

                  <details className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                    <summary className="cursor-pointer font-semibold">Ver detalles IA</summary>
                    <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{JSON.stringify(source.ia_result, null, 2)}</pre>
                  </details>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
                      onClick={() => {
                        const quiz = normalizeQuiz(source.ia_result);
                        setActiveQuiz(quiz);
                      }}
                    >
                      <TbBolt size={16} />
                      Iniciar test
                    </button>
                    <button
                      onClick={() => handleDelete(source.id)}
                      disabled={deleting === source.id}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-300 px-3 text-sm font-semibold text-rose-600 transition-all duration-300 hover:scale-[1.02] hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20"
                    >
                      <TbTrash size={16} />
                      {deleting === source.id ? "Eliminando" : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {activeQuiz && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quiz activo</h3>
            <button
              onClick={() => setActiveQuiz(null)}
              className="h-10 rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cerrar quiz
            </button>
          </div>
          <QuizPlayer quiz={activeQuiz} />
        </div>
      )}
    </section>
  );
};

export default SourceManager;
