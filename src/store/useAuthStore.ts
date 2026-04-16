// @ts-ignore
import { create } from "zustand";
import { supabase } from "../shared/lib/supabase";

interface AuthState {
	user: any;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
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
			set({ user: data.user });

			// Crear perfil si no existe
			if (data.user) {
				try {
					const { data: profile, error: profileError } = await supabase
						.from("profiles")
						.select("id")
						.eq("id", data.user.id)
						.single();

					console.log("DEBUG profile:", profile, "profileError:", profileError);
					if (profileError) {
						if (profileError.code === "PGRST116") {
							// Solo crear si el error es que no existe
							console.log(
								"Intentando crear perfil con id:",
								data.user.id,
								"email:",
								data.user.email,
							);
							const { error: insertError } = await supabase
								.from("profiles")
								.insert([{ id: data.user.id, email: data.user.email }]);
							if (insertError) {
								console.error("Error creando perfil:", insertError.message);
								alert(
									"No se pudo crear el perfil en Supabase: " +
										insertError.message,
								);
							}
						} else {
							// Otro error: mostrar y no crear
							console.warn("Error buscando perfil:", profileError.message);
							alert(
								"Error buscando perfil en Supabase: " + profileError.message,
							);
						}
					}
					// Si profile existe y no hay error, no hacer nada
				} catch (err: any) {
					console.error(
						"Error inesperado creando perfil:",
						err?.message || err,
					);
					alert("Error inesperado creando perfil: " + (err?.message || err));
				}
			}
		},

		register: async (email: string, password: string) => {
			set({ loading: true });
			const { data, error } = await supabase.auth.signUp({ email, password });
			set({ loading: false });
			if (error) throw error;
			// No crear perfil aquí, solo tras login exitoso
		},

		logout: async () => {
			await supabase.auth.signOut();
			set({ user: null });
		},
	}),
);
