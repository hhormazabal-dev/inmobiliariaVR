import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    console.error(`[api/catalog/comunas] Falta configurar ${name}`);
  }
  return value ?? "";
}

function toNumber(value: unknown) {
  if (value === null || typeof value === "undefined") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  if (typeof value !== "string") return null;

  const compact = value.trim();
  if (!compact) return null;

  if (compact.includes(",")) {
    const parsed = Number(compact.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number(compact.replace(/\./g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    return NextResponse.json({ comunas: [], uf: { min: null, max: null } });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("projects")
    .select("comuna, uf_min, uf_max")
    .order("comuna", { ascending: true });

  if (error) {
    console.error("[api/catalog/comunas] Error consultando proyectos:", error);
    return NextResponse.json({ comunas: [], uf: { min: null, max: null } });
  }

  const comunasSet = new Set<string>();
  const comunas: string[] = [];
  let globalMin: number | null = null;
  let globalMax: number | null = null;

  for (const row of data ?? []) {
    const name = row.comuna?.trim();
    if (name && !comunasSet.has(name)) {
      comunasSet.add(name);
      comunas.push(name);
    }

    const minValue = toNumber(row.uf_min);
    const maxValue = toNumber(row.uf_max);

    if (minValue !== null) {
      globalMin = globalMin === null ? minValue : Math.min(globalMin, minValue);
    }
    if (maxValue !== null) {
      globalMax = globalMax === null ? maxValue : Math.max(globalMax, maxValue);
    }
  }

  return NextResponse.json({
    comunas,
    uf: {
      min: globalMin,
      max: globalMax,
    },
  });
}
