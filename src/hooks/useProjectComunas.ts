import { useEffect, useState } from "react";

export function useProjectComunas() {
  const [comunas, setComunas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/catalog/comunas", { cache: "no-store" });
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as { comunas?: string[] };
        if (!active) return;
        if (Array.isArray(data.comunas)) {
          setComunas(
            data.comunas
              .filter((item): item is string => Boolean(item && item.trim()))
              .map((item) => item.trim())
              .sort((a, b) => a.localeCompare(b, "es")),
          );
        }
      } catch (error) {
        console.warn("[useProjectComunas] Error obteniendo comunas:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return { comunas, loading };
}
