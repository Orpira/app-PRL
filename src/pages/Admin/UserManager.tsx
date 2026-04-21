import React, { useEffect, useState } from "react";
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

  const handleRoleChange = async (id: string, newRole: "user" | "admin") => {
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setUsers((prev) => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="mt-8">
      <h2 className="font-semibold mb-2">Gestión de usuarios</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.email}</td>
              <td className="p-2 uppercase">{user.role}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value as "user" | "admin")}
                  className="border rounded px-2 py-1"
                  disabled={user.role === "admin" && users.filter(u => u.role === "admin").length === 1}
                  title={user.role === "admin" && users.filter(u => u.role === "admin").length === 1 ? "Debe haber al menos un admin" : ""}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManager;
