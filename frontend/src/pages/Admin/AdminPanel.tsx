import React from "react";
import SourceUpload from "./SourceUpload";
import SourceManager from "./SourceManager";
import UserManager from "./UserManager";

const AdminPanel: React.FC = () => {
  const [tab, setTab] = React.useState("sources");

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <div className="flex gap-4 mb-6">
        <button className={tab === "sources" ? "font-bold" : ""} onClick={() => setTab("sources")}>Fuentes</button>
        <button className={tab === "users" ? "font-bold" : ""} onClick={() => setTab("users")}>Usuarios</button>
        <button className={tab === "categories" ? "font-bold" : ""} onClick={() => setTab("categories")}>Categorías</button>
      </div>
      {tab === "sources" && (
        <>
          <SourceUpload />
          <hr className="my-6" />
          <SourceManager />
        </>
      )}
      {tab === "users" && <UserManager />}
      {/* El tab de categorías puede agregarse después */}
    </div>
  );
};

export default AdminPanel;
