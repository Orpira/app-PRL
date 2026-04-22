-- Migración: Crear tabla sources para el sistema de ingesta de contenido
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text,
  type text,
  content text,
  ia_result jsonb,
  created_at timestamp with time zone default now()
);
