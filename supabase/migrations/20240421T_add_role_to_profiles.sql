-- Añadir columna 'role' a la tabla profiles si no existe
alter table profiles add column if not exists role text not null default 'user';
