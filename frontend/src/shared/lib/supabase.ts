// @ts-ignore: Ignorar error de módulo no encontrado para desarrollo local
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL!,
	import.meta.env.VITE_SUPABASE_ANON_KEY!,
);
