// @ts-ignore
import { create } from "zustand";
import { supabase } from "../shared/lib/supabase";

import type { UserRole } from "../types";
interface AuthState {
	user: any;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, role?: UserRole) => Promise<void>;
	logout: () => Promise<void>;
	setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>(
	(set: (partial: Partial<AuthState>) => void) => ({
		user: null,
		loading: false,

		setUser: (user) => set({ user }),

		login: async (email: string, password: string) => {
			set({ loading: true });
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			set({ loading: false });
			if (error) throw error;
			// Obtener perfil y rol
			set({ user: data.user });
			if (data.user) {
				try {
					const { data: profile, error: profileError } = await supabase
						.from("profiles")
						.select("id, email, role")
						.eq("id", data.user.id)
						.single();
					if (profile) {
						set({ user: { ...data.user, role: profile.role || "user" } });
					}
					if (profileError) {
						if (profileError.code === "PGRST116") {
							const { error: insertError } = await supabase
								.from("profiles")
								.insert([{ id: data.user.id, email: data.user.email, role: "user" }]);
							if (insertError) {
								console.error("Error creando perfil:", insertError.message);
								alert(
									"No se pudo crear el perfil en Supabase: " +
									insertError.message,
								);
							}
						} else {
							console.warn("Error buscando perfil:", profileError.message);
							alert(
								"Error buscando perfil en Supabase: " + profileError.message,
							);
						}
					}
				} catch (err: any) {
					console.error(
						"Error inesperado creando perfil:",
						err?.message || err,
					);
					alert("Error inesperado creando perfil: " + (err?.message || err));
				}
			}
		},

		register: async (email: string, password: string, role: UserRole = "user") => {
			set({ loading: true });
			let finalRole = role;
			// Validar en backend: si ya existe admin, forzar rol a 'user'
			if (role === "admin") {
				const { data: admins } = await supabase.from("profiles").select("id").eq("role", "admin").limit(1);
				if (admins && admins.length > 0) {
					finalRole = "user";
				}
			}
			const { data, error } = await supabase.auth.signUp({ email, password });
			set({ loading: false });
			if (error) throw error;
			// Crear perfil con rol si el registro fue exitoso
			if (data.user) {
				await supabase.from("profiles").insert([
				  { id: data.user.id, email: data.user.email, role: finalRole }
				]);
			}
		},

		logout: async () => {
			await supabase.auth.signOut();
			set({ user: null });
		},
	}),
);
