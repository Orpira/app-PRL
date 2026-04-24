import React from "react";
import { TbBooks, TbLayoutGrid, TbUsers } from "react-icons/tb";
import SourceUpload from "./SourceUpload";
import SourceManager from "./SourceManager";
import UserManager from "./UserManager";

type AdminTab = { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; disabled?: boolean };

const tabs: AdminTab[] = [
  { id: "sources", label: "Fuentes", icon: TbBooks },
  { id: "users", label: "Usuarios", icon: TbUsers },
  { id: "categories", label: "Categorías", icon: TbLayoutGrid, disabled: true },
];

const AdminPanel: React.FC = () => {
  const [tab, setTab] = React.useState("sources");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 lg:px-12">
      <header className="mb-8 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Dashboard PRL</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Panel de administración</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Visualización moderna con tarjetas, espacios amplios y acciones rápidas para gestionar fuentes, quizzes y usuarios.
        </p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-3" aria-label="Navegación del panel de administración">
        {tabs.map(({ id, label, icon: Icon, disabled }) => {
          const isActive = tab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => !disabled && setTab(id)}
              disabled={disabled}
              className={[
                "group inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all duration-300",
                isActive
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-600 shadow-sm shadow-blue-500/10 dark:text-blue-300"
                  : "border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white",
                disabled ? "cursor-not-allowed opacity-50 hover:translate-y-0" : "",
              ].join(" ")}
            >
              <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="space-y-8">
        {tab === "sources" && (
          <>
            <SourceUpload />
            <SourceManager />
          </>
        )}
        {tab === "users" && <UserManager />}
      </div>
    </section>
  );
};

export default AdminPanel;
