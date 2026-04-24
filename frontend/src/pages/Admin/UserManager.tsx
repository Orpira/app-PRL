import React, { useEffect, useMemo, useState } from "react";
import { TbShieldCheck, TbUser } from "react-icons/tb";
import { supabase } from "../../shared/lib/supabase";
import type { User } from "../../types";

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("id, email, role");
      if (error) setError(error.message);
      else setUsers(data || []);
      setLoading(false);
    })();
  }, []);

  const adminsCount = useMemo(() => users.filter((user) => user.role === "admin").length, [users]);

  const handleRoleChange = async (id: string, newRole: "user" | "admin") => {
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
    }
  };

  if (error) return <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Gestión de usuarios</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Asignación de roles con controles seguros para evitar quedarte sin administradores.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {users.length} cuentas · {adminsCount} administradores
        </div>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-36 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="skeleton-circle mb-3" />
              <div className="skeleton-title" />
              <div className="skeleton-text" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((user) => {
            const isAdmin = user.role === "admin";
            const lockAdminRole = isAdmin && adminsCount === 1;

            return (
              <article
                key={user.id}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-xl bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {isAdmin ? <TbShieldCheck size={20} /> : <TbUser size={20} />}
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isAdmin ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                    {isAdmin ? "Admin" : "Usuario"}
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm font-medium text-slate-900 dark:text-slate-100">{user.email}</p>

                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Cambiar rol
                  <select
                    value={user.role}
                    onChange={(event) => handleRoleChange(user.id, event.target.value as "user" | "admin")}
                    disabled={lockAdminRole}
                    title={lockAdminRole ? "Debe haber al menos un admin" : ""}
                    className="mt-2 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </label>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default UserManager;
