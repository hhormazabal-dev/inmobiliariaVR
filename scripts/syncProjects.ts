#!/usr/bin/env tsx

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DATA = [
  { name: "Urban La Florida", comuna: "LA FLORIDA", uf_min: "3140" },
  { name: "Urban La Florida", comuna: "LA FLORIDA", uf_min: "4400" },
  { name: "Mirador", comuna: "LA FLORIDA", uf_min: "2681" },
  { name: "BW815", comuna: "LA FLORIDA", uf_min: "3020" },
  { name: "MOOD", comuna: "LA FLORIDA", uf_min: "2824" },
  { name: "Liverpool", comuna: "LA FLORIDA", uf_min: "2081" },
  { name: "TRINIDAD III", comuna: "LA CISTERNA", uf_min: "2153" },
  { name: "PLAZA CERVANTES - B", comuna: "LA CISTERNA", uf_min: "2129" },
  { name: "DON CLAUDIO", comuna: "LA CISTERNA", uf_min: "2850" },
  { name: "CARVAJAL", comuna: "LA CISTERNA", uf_min: "2850" },
  { name: "ALTO GOYCOLEA", comuna: "LA CISTERNA", uf_min: "2478" },
  { name: "JARDIN DE ALVARADO", comuna: "INDEPENDENCIA", uf_min: "2133" },
  { name: "BEZANILLA", comuna: "INDEPENDENCIA", uf_min: "2270" },
  { name: "INDEPENDENCIA ACTIVA", comuna: "INDEPENDENCIA", uf_min: "4901" },
  { name: "PLAZA CHACABUCO", comuna: "INDEPENDENCIA", uf_min: "3660" },
  { name: "HIPODROMO PLAZA", comuna: "INDEPENDENCIA", uf_min: "2960" },
  { name: "INDI", comuna: "INDEPENDENCIA", uf_min: "2544" },
  { name: "SANTA MARIA", comuna: "INDEPENDENCIA", uf_min: "2459" },
  { name: "PINTOR CICARELLI", comuna: "SAN JOAQUIN", uf_min: "2369" },
  { name: "ALTO LAZCANO", comuna: "SAN MIGUEL", uf_min: "4690" },
  { name: "VISTA COSTANERA", comuna: "RENCA", uf_min: "2080" },
  { name: "APOSTOL SANTIAGO", comuna: "RENCA", uf_min: "2141" },
  { name: "PLAZA QUILICURA", comuna: "QUILICURA", uf_min: "2183" },
  { name: "SANTOS", comuna: "STGO. CENTRO", uf_min: "2714" },
  { name: "ARGOMEDO", comuna: "STGO. CENTRO", uf_min: "3711" },
  { name: "BARRIO CENTENO", comuna: "STGO. CENTRO", uf_min: "2422" },
  { name: "MIRADOR MAPOCHO", comuna: "QUINTA NORMAL", uf_min: "2187" },
  { name: "DOMINICA", comuna: "RECOLETA", uf_min: "2820" },
  { name: "CONECTA", comuna: "HUECHURABA", uf_min: "3550" },
  { name: "SUECIA", comuna: "PROVIDENCIA", uf_min: "8460" },
  { name: "OWN", comuna: "ÑUÑOA", uf_min: "3050" },
  { name: "VISTA RELONCAVÍ", comuna: "PUERTO MONTT", uf_min: "2363" },
  { name: "PARQUE GERMANIA", comuna: "PUERTO MONTT", uf_min: "2559" },
  { name: "ALDUNATE", comuna: "TEMUCO", uf_min: "2338" },
  { name: "FERROPARQUE", comuna: "TEMUCO", uf_min: "2330" },
  { name: "CUMBRES DE PEÑUELAS", comuna: "COQUIMBO", uf_min: "2290" },
  { name: "EDIFICIO HA", comuna: "COQUIMBO", uf_min: "2010" },
  { name: "EDIFICIO HA", comuna: "COQUIMBO", uf_min: "4857" },
  { name: "CACERES", comuna: "RANCAGUA", uf_min: "2369" },
  { name: "NEO AZAPA", comuna: "ARICA", uf_min: "2456" },
  { name: "BOSQUEMAR", comuna: "CONCON", uf_min: "4720" },
  { name: "LOMAS DE PUYAI", comuna: "PAPUDO", uf_min: "2260" },
  { name: "INDIGO", comuna: "PUERTO VARAS", uf_min: "8535" },
  { name: "COSTA PACIFICO 1", comuna: "LA SERENA", uf_min: "5065" },
  { name: "VISTA REÑACA", comuna: "VIÑA DEL MAR", uf_min: "5552" },
];

function normalizeComuna(raw: string): string {
  const s = raw?.trim().toUpperCase();
  if (!s) return "";
  if (s.startsWith("MUERTO")) return "Puerto Montt";
  if (s.startsWith("STGO")) return "Santiago Centro";
  if (s === "ÑUÑOA") return "Ñuñoa";
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");
}

function toNumberUF(x: string): number | null {
  if (!x) return null;
  const n = x.replace(/\./g, "").replace(",", ".");
  const f = Number(n);
  return Number.isFinite(f) ? f : null;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[syncProjects] Missing environment variable ${name}`);
  }
  return value;
}

async function upsertProjects(client: SupabaseClient) {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of DATA) {
    const name = item.name?.trim();
    const comuna = normalizeComuna(item.comuna);
    const ufMin = toNumberUF(item.uf_min);

    if (!name || !comuna || ufMin === null) {
      skipped += 1;
      console.warn(
        `[syncProjects] Registro omitido por datos inválidos: ${JSON.stringify(item)}`,
      );
      continue;
    }

    const { data: existing, error: selectError } = await client
      .from("projects")
      .select("id")
      .eq("name", name)
      .eq("comuna", comuna)
      .maybeSingle();

    if (selectError && selectError.code !== "PGRST116") {
      skipped += 1;
      console.error(
        `[syncProjects] Error consultando proyecto (${name}, ${comuna}):`,
        selectError,
      );
      continue;
    }

    if (existing?.id) {
      const { error: updateError } = await client
        .from("projects")
        .update({
          uf_min: ufMin,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) {
        skipped += 1;
        console.error(
          `[syncProjects] Error actualizando proyecto (${name}, ${comuna}):`,
          updateError,
        );
        continue;
      }

      updated += 1;
    } else {
      const { error: insertError } = await client.from("projects").insert({
        name,
        comuna,
        uf_min: ufMin,
        status: "Disponible",
        featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        skipped += 1;
        console.error(
          `[syncProjects] Error insertando proyecto (${name}, ${comuna}):`,
          insertError,
        );
        continue;
      }

      inserted += 1;
    }
  }

  return { inserted, updated, skipped };
}

async function main() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!url || !key) {
    throw new Error(
      "[syncProjects] Debes configurar NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const summary = await upsertProjects(supabase);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error("[syncProjects] Falló la sincronización:", error);
  process.exitCode = 1;
});
