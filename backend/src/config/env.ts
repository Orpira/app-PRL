import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  PORT: z.string().default("3001"),
});

export const env = schema.parse(process.env);

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return value;
}