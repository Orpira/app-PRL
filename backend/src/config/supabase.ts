// @ts-ignore: Declaración temporal si faltan los tipos de @supabase/supabase-js
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Asegúrate de que env tenga las propiedades necesarias para Supabase
// Si usas TypeScript y tienes un tipo para env, extiéndelo aquí temporalmente
// Esto es solo para evitar el error de propiedad inexistente
if (!('SUPABASE_URL' in env) || !('SUPABASE_SERVICE_ROLE_KEY' in env)) {
  throw new Error('Faltan variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en env');
}

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY // 🔥 importante
);