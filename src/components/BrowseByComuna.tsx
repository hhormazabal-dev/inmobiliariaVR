import Link from "next/link";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { buildCommuneMeta, prettifyName } from "@/lib/territoryMeta";

type CommuneCount = {
  name: string;
  count: number;
};

const DEFAULT_COMMUNES: CommuneCount[] = [
  { name: "Santiago Centro", count: 18 },
  { name: "Ñuñoa", count: 12 },
  { name: "Providencia", count: 9 },
  { name: "La Florida", count: 7 },
  { name: "San Miguel", count: 6 },
  { name: "Independencia", count: 5 },
];

const getCommunes = cache(async (): Promise<CommuneCount[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return [];
  }

  try {
    const client = createClient(url, key, {
      auth: { persistSession: false },
    });

    const { data, error } = await client
      .from("projects")
      .select("comuna,status");

    if (error) {
      console.error("[BrowseByComuna] Error consultando proyectos:", error);
      return [];
    }

    const counts = new Map<string, number>();

    for (const row of data ?? []) {
      const comuna = row.comuna?.trim();
      if (!comuna) continue;

      const status = row.status?.toLowerCase();
      if (
        status &&
        (status.includes("cerrado") ||
          status.includes("no disponible") ||
          status.includes("finalizado"))
      ) {
        continue;
      }

      counts.set(comuna, (counts.get(comuna) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name, "es");
      });
  } catch (error) {
    console.error("[BrowseByComuna] Error inesperado:", error);
    return [];
  }
});

export default async function BrowseByComuna() {
  const data = await getCommunes();
  const communes = data.length > 0 ? data : DEFAULT_COMMUNES;

  if (communes.length === 0) {
    return null;
  }

  const topCommunes = communes.slice(0, 9);

  return (
    <section className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-[28px] px-6 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,201,103,0.16),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,33,73,0.14),transparent_60%)]" />
      <header className="mb-10 space-y-3 text-center md:space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold">
          Comunas en foco
        </p>
        <h2 className="font-display text-[28px] font-semibold text-brand-navy md:text-[34px]">
          Vive donde crece tu estilo de vida.
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-brand-mute md:text-base">
          Elige la comuna que te interesa y descubre los proyectos disponibles
          hoy. Información actualizada con asesoría gratuita para acompañarte en
          la decisión.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topCommunes.map((commune, index) => {
          const meta = buildCommuneMeta(commune.name, index);
          const displayName = meta.displayName ?? prettifyName(commune.name);

          return (
            <article
              key={commune.name}
              className="group relative flex h-full flex-col gap-4 rounded-[18px] bg-white/95 p-6 text-left shadow-[0_18px_40px_rgba(12,24,52,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(12,24,52,0.12)]"
            >
              <span className="pointer-events-none absolute inset-0 rounded-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_0_1px_rgba(12,24,52,0.06)]" />
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-navy/40">
                  Comuna
                </p>
                <h3 className="text-[20px] font-semibold text-brand-navy">
                  {displayName}
                </h3>
                <p className="text-xs uppercase tracking-[0.28em] text-brand-gold/85">
                  {commune.count} proyecto{commune.count !== 1 ? "s" : ""}
                </p>
              </div>

              {meta.highlight && (
                <p className="mt-2 text-sm font-semibold text-brand-navy/75">
                  {meta.highlight}
                </p>
              )}
              {meta.detail && (
                <p className="text-sm leading-relaxed text-brand-mute">
                  {meta.detail}
                </p>
              )}

              <div className="mt-auto flex items-center justify-between pt-5 text-sm font-semibold text-brand-navy">
                <Link
                  href={`/projects?comuna=${encodeURIComponent(commune.name)}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy transition group-hover:text-brand-gold"
                >
                  Ver proyectos →
                </Link>
                <span className="text-xs font-medium uppercase tracking-[0.28em] text-brand-mute">
                  {commune.count} proyectos
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
