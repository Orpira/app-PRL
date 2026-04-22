import { useAuthStore } from "../../store/useAuthStore";

export function AdminRouteGuard({ children }: { children: JSX.Element }) {
  const user = useAuthStore((state) => state.user);
  if (!user || user.role !== "admin") {
    return <div className="text-red-600 p-8 text-center">Acceso restringido solo para administradores.</div>;
  }
  return children;
}
