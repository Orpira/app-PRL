// @ts-ignore
import { create } from "zustand";
import { supabase } from "../shared/lib/supabase";

interface AuthState {
	user: any;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set: (partial: Partial<AuthState>) => void) => ({
	user: null,
	loading: true,

	login: async (email: string, password: string) => {
		const { data } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		set({ user: data.user });
	},

	register: async (email: string, password: string) => {
		await supabase.auth.signUp({ email, password });
	},

	logout: async () => {
		await supabase.auth.signOut();
		set({ user: null });
	},
}));
