import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import SafeImage from "@/components/SafeImage";
import { toPublicStorageUrl } from "@/lib/supabaseImages";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";

import RegionExplorer, {
  type RegionCardData,
  type RegionCommuneData,
} from "@/components/RegionExplorer";
import {
  buildCommuneMeta,
  getRegionMeta,
  prettifyName,
  resolveRegion,
} from "@/lib/territoryMeta";

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

const HERO_IMAGE =
  toPublicStorageUrl("nunoa/own/VISTA-GENERAL-own--scaled.jpg") ??
  FALLBACK_IMAGE_DATA;

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

function buildRegionGroups(communes: CommuneCount[]): RegionCardData[] {
  const buckets = new Map<
    string,
    { total: number; communes: CommuneCount[] }
  >();

  communes.forEach((entry) => {
    const region = resolveRegion(entry.name);
    if (!buckets.has(region)) {
      buckets.set(region, { total: 0, communes: [] });
    }
    const bucket = buckets.get(region)!;
    bucket.total += entry.count;
    bucket.communes.push(entry);
  });

  const groups: RegionCardData[] = Array.from(buckets.entries()).map(
    ([regionName, value], regionIndex) => {
      const meta = getRegionMeta(regionName, regionIndex);
      const communesDetail: RegionCommuneData[] = value.communes
        .sort((a, b) => b.count - a.count)
        .map((commune, index) => {
          const metaCommune = buildCommuneMeta(commune.name, index);
          const displayName =
            metaCommune.displayName ?? prettifyName(commune.name);
          return {
            id: `${regionName}-${commune.name}`,
            name: commune.name,
            displayName,
            count: commune.count,
            highlight: metaCommune.highlight,
            detail: metaCommune.detail,
            slug: encodeURIComponent(commune.name),
          };
        });

      return {
        id: regionName,
        name: regionName,
        highlight: meta.highlight,
        detail: meta.detail,
        image: meta.image,
        totalProjects: value.total,
        communes: communesDetail,
      };
    },
  );

  return groups.sort((a, b) => b.totalProjects - a.totalProjects);
}

export default async function BrowseByComuna() {
  const data = await getCommunes();
  const communes = data.length > 0 ? data : DEFAULT_COMMUNES;
  const regions = buildRegionGroups(communes);

  if (regions.length === 0) {
    return null;
  }

  return (
    <section className="relative mx-auto mt-10 max-w-7xl overflow-hidden rounded-[40px] border border-white/60 px-6 py-16 shadow-[0_28px_80px_rgba(14,33,73,0.12)]">
      <div className="absolute inset-0">
        <SafeImage
          src={HERO_IMAGE}
          alt="Paisaje urbano"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/92 via-white/88 to-[#f3f6fb]/92" />
      </div>
      <span className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-gold/20 blur-[140px]" />
      <span className="pointer-events-none absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-brand-navy/20 blur-[130px]" />

      <header className="relative mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
          Comunas en foco
        </p>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-brand-navy md:text-4xl">
            Vive donde crece tu estilo de vida.
          </h2>
          <p className="mt-3 text-sm text-brand-mute md:text-base">
            Explora las regiones con mejores indicadores de conectividad,
            rentabilidad y experiencia diaria. Selecciona una región para ver
            sus comunas destacadas y los proyectos disponibles.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full border border-brand-navy/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy/70">
          Actualizado 2025
        </div>
      </header>

      <div className="relative">
        <RegionExplorer regions={regions} />
      </div>
    </section>
  );
}
