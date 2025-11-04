#!/usr/bin/env tsx
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Configura SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY",
  );
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const slugify = (input: string) =>
  (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const PLACEHOLDER = Buffer.from("placeholder");

async function main() {
  const { data: rows, error } = await supabase
    .from("projects")
    .select("id, name, comuna, cover_url");

  if (error) throw error;

  for (const row of rows ?? []) {
    if (!row.id || !row.name) continue;

    const currentPath = row.cover_url?.trim();
    const defaultPath = `${slugify(row.comuna ?? "")}/${slugify(
      row.name,
    )}/portada.jpg`.replace(/^\/+/, "");

    const path = currentPath && currentPath !== "" ? currentPath : defaultPath;

    if (!currentPath || currentPath === "") {
      await supabase
        .from("projects")
        .update({ cover_url: path, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      console.log(`✓ cover_url asignado: ${row.name} -> ${path}`);
    }

    const { error: uploadError } = await supabase.storage
      .from("projects")
      .upload(path, PLACEHOLDER, {
        upsert: false,
        contentType: "application/octet-stream",
      });

    if (uploadError) {
      if (uploadError.message?.includes("already exists")) {
        console.log(`✔ carpeta/listado ya existe: ${path}`);
      } else {
        console.error(`✖ no se pudo crear ${path}`, uploadError.message);
      }
    } else {
      console.log(`＋ carpeta creada (placeholder): ${path}`);
    }
  }

  console.log(
    "Listo. Sube tus portadas reales sobre esos paths cuando quieras.",
  );
}

main().catch((err) => {
  console.error("[ensureProjectFolders] fallo:", err);
  process.exit(1);
});
