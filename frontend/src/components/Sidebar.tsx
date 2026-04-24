import { useState } from "react";
import { TbBook2, TbBooks, TbChartBar, TbChevronLeft, TbChevronRight, TbHome, TbListCheck, TbMenu2, TbMessageChatbot, TbSettings, TbX } from "react-icons/tb";
import { useAuthStore } from "../store/useAuthStore";

interface Props {
  view: string;
  setView: (v: string) => void;
}

export default function Sidebar({ view, setView }: Props) {
  const user = useAuthStore((state) => state.user);
  const items = [
    { id: "home", label: "Inicio", icon: TbHome },
    { id: "study", label: "Modo Estudio", icon: TbBook2 },
    { id: "exam", label: "Examen", icon: TbListCheck },
    { id: "chat", label: "Asistente IA", icon: TbMessageChatbot },
    { id: "stats", label: "Estadísticas", icon: TbChartBar },
    { id: "sources", label: "Fuentes IA", icon: TbBooks },
    ...(user?.role === "admin" ? [{ id: "admin", label: "Administración", icon: TbSettings }] : []),
  ];

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarContent = (
    <>
      <div className="px-3 pb-2 pt-4">
        {!collapsed && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Plataforma PRL</p>
            <p className="mt-1 text-sm text-slate-300">Aprendizaje y evaluación</p>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2 py-3" aria-label="Navegación principal">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              title={collapsed ? item.label : undefined}
              className={[
                "group flex h-11 w-full items-center rounded-xl px-3 text-sm font-medium transition-all duration-300",
                collapsed ? "justify-center" : "gap-3",
                isActive
                  ? "bg-blue-500/20 text-blue-200 ring-1 ring-blue-300/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white",
              ].join(" ")}
            >
              <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pb-4 pt-2 text-[11px] text-slate-500">{!collapsed && "Ley 31/1995 LPRL · v2.0"}</div>
    </>
  );

  return (
    <>
      <aside className={`hidden h-screen flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur md:flex ${collapsed ? "w-20 min-w-[80px]" : "w-64 min-w-[240px]"} transition-all duration-300`}>
        <button
          className="ml-auto mr-3 mt-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <TbChevronRight size={18} /> : <TbChevronLeft size={18} />}
        </button>
        {sidebarContent}
      </aside>

      <div className="md:hidden">
        <button
          className="fixed left-4 top-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          <TbMenu2 size={22} />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setOpen(false)} />
            <aside className="fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950 p-1 animate-slideIn">
              <button className="ml-auto mt-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800" onClick={() => setOpen(false)} aria-label="Cerrar menú">
                <TbX size={20} />
              </button>
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = view === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setOpen(false);
                    }}
                    className={`mx-2 mt-1 flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${isActive ? "bg-blue-500/20 text-blue-200" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </aside>
          </>
        )}
      </div>
    </>
  );
}
