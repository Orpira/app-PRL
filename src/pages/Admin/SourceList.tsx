import React, { useEffect, useState } from "react";
import { supabase } from "../../shared/lib/supabase";

const SourceList: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("sources").select("id, name, type, categories, created_at");
      if (error) setError(error.message);
      else setSources(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div>Cargando fuentes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="font-semibold mb-2">Fuentes registradas</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nombre</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Categorías</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((src) => (
            <tr key={src.id} className="border-t">
              <td className="p-2">{src.name}</td>
              <td className="p-2 uppercase">{src.type}</td>
              <td className="p-2">
                {Array.isArray(src.categories) ? src.categories.join(", ") : src.categories}
              </td>
              <td className="p-2">{src.created_at?.slice(0, 10)}</td>
              <td className="p-2">
                <button className="text-blue-700 hover:underline">Editar</button>
                <button className="ml-2 text-red-700 hover:underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SourceList;
