import { createClient } from "@supabase/supabase-js";
import { normalizeStoragePath, toPublicStorageUrl } from "@/lib/supabaseImages";
import { resolveFolderName } from "@/lib/galleryFolders";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[gallery] Falta configurar las variables de entorno de Supabase.",
  );
}

export type ProjectGalleryAssets = {
  images: string[];
  brochure: string | null;
};

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
        },
      })
    : null;

function isImageFile(name: string) {
  return /\.(jpe?g|png|webp|gif|heic)$/i.test(name);
}

function isPdfFile(name: string) {
  return /\.pdf$/i.test(name);
}

function extractFolderFromUrl(url?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const bucketIndex = parts.findIndex((segment) => segment === "projects");
    if (bucketIndex === -1) {
      return "";
    }

    const folderParts = parts.slice(bucketIndex + 1, -1);
    if (folderParts.length === 0) {
      return "";
    }

    return folderParts.map((segment) => decodeURIComponent(segment)).join("/");
  } catch {
    return "";
  }
}

function slugify(input: string) {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function withDownloadParam(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("download")) {
      parsed.searchParams.set("download", "1");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function listProjectImages(
  projectName: string,
  coverUrl?: string,
  comuna?: string,
): Promise<ProjectGalleryAssets> {
  async function fetchViaApi(): Promise<ProjectGalleryAssets> {
    if (!projectName)
      return {
        images: [],
        brochure: null,
      };
    const params = new URLSearchParams();
    params.set("name", projectName);
    if (comuna) params.set("comuna", comuna);
    if (coverUrl) params.set("coverUrl", coverUrl);

    try {
      const res = await fetch(`/api/project-images?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) {
        console.error(
          "[gallery] Fallback API respondió error:",
          res.status,
          await res.text(),
        );
        return { images: [], brochure: null };
      }
      const data = (await res.json()) as {
        images?: string[];
        brochure?: string | null;
      };
      return {
        images: data.images ?? [],
        brochure: data.brochure ?? null,
      };
    } catch (error) {
      console.error("[gallery] Error usando fallback API:", error);
      return { images: [], brochure: null };
    }
  }

  const apiResult = await fetchViaApi();
  let brochure: string | null = withDownloadParam(apiResult.brochure) ?? null;
  let bestImages = Array.from(
    new Set(
      (apiResult.images ?? [])
        .map((value) => toPublicStorageUrl(value))
        .filter((url): url is string => Boolean(url)),
    ),
  );

  if (!supabase || !SUPABASE_URL) {
    return { images: bestImages, brochure };
  }

  const folderFromName = resolveFolderName(projectName);
  const folderFromUrl = extractFolderFromUrl(coverUrl);
  const slugName = slugify(folderFromName || projectName);
  const slugComuna = slugify(comuna ?? "");

  const brochureCandidates: string[] = [];
  const addBrochureCandidate = (folder: string) => {
    if (!folder) return;
    const normalized = normalizeStoragePath(`${folder}/1.pdf`);
    if (!normalized) return;
    const url = withDownloadParam(toPublicStorageUrl(normalized));
    if (url) {
      brochureCandidates.push(url);
    }
  };

  const foldersToVisit = Array.from(
    new Set(
      [
        folderFromUrl,
        folderFromName,
        slugName,
        slugComuna && slugName ? `${slugComuna}/${slugName}` : "",
      ].filter(Boolean),
    ),
  );

  for (const folder of foldersToVisit) {
    addBrochureCandidate(folder);
  }

  if (foldersToVisit.length === 0) {
    return { images: bestImages, brochure };
  }

  const visited = new Set<string>();
  const files: { name: string; path: string }[] = [];
  const storagePathSet = new Set<string>();
  const setBrochureFromPath = (path: string | null | undefined) => {
    if (!path) return;
    const normalized = normalizeStoragePath(path);
    if (!normalized) return;
    const url = withDownloadParam(toPublicStorageUrl(normalized));
    if (!url) return;
    const preferred = /(?:^|\/)1\.pdf$/i.test(normalized);
    if (!brochure || preferred) {
      brochure = url;
    }
  };

  async function collect(currentFolder: string) {
    if (visited.has(currentFolder)) {
      return;
    }
    visited.add(currentFolder);

    const { data, error } = await supabase!.storage
      .from("projects")
      .list(currentFolder, {
        limit: 200,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error(
        `[gallery] Error listando carpeta ${currentFolder}:`,
        error,
      );
      return;
    }

    for (const entry of data ?? []) {
      if (!entry.name) continue;
      const entryPath = currentFolder
        ? `${currentFolder}/${entry.name}`
        : entry.name;

      const isDirectory = !entry.id;
      if (isDirectory) {
        await collect(entryPath);
        continue;
      }

      if (isPdfFile(entry.name)) {
        setBrochureFromPath(entryPath);
        continue;
      }

      if (!isImageFile(entry.name)) continue;

      const normalizedPath = normalizeStoragePath(entryPath);
      if (!normalizedPath) continue;
      storagePathSet.add(normalizedPath.toLowerCase());
      files.push({ name: entry.name, path: normalizedPath });
    }
  }

  for (const folder of foldersToVisit) {
    await collect(folder);
  }

  if (files.length <= 1) {
    async function fetchGallery(matchComuna: boolean) {
      if (!projectName) return;
      let query = supabase!
        .from("projects")
        .select("gallery_urls, cover_url")
        .ilike("name", `%${projectName}%`);

      if (matchComuna && comuna) {
        query = query.ilike("comuna", `%${comuna}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) {
        if (error.code !== "PGRST116") {
          console.error(
            `[gallery] Error consultando galerías de ${projectName}:`,
            error,
          );
        }
        return;
      }

      for (const row of data ?? []) {
        if (row.gallery_urls?.length) {
          for (const entry of row.gallery_urls) {
            if (!entry) continue;
            const normalizedEntry = normalizeStoragePath(entry);
            const entryName =
              normalizedEntry?.split("/").pop() ??
              entry.split("/").pop() ??
              entry;
            if (isPdfFile(entryName)) {
              setBrochureFromPath(normalizedEntry ?? entry);
              continue;
            }
            if (!isImageFile(entryName)) continue;
            const publicUrl = toPublicStorageUrl(entry);
            if (!publicUrl) continue;
            if (storagePathSet.size > 0) {
              const key = normalizedEntry?.toLowerCase();
              if (!key || !storagePathSet.has(key)) {
                continue;
              }
            }
            if (normalizedEntry) {
              storagePathSet.add(normalizedEntry.toLowerCase());
              files.push({
                name: normalizedEntry.split("/").pop() ?? normalizedEntry,
                path: normalizedEntry,
              });
            } else {
              files.push({
                name: entry.split("/").pop() ?? entry,
                path: entry,
              });
            }
          }
        }

        if (row.cover_url) {
          const normalizedCover = normalizeStoragePath(row.cover_url);
          const coverName =
            normalizedCover?.split("/").pop() ??
            row.cover_url.split("/").pop() ??
            row.cover_url;
          if (isPdfFile(coverName)) {
            setBrochureFromPath(normalizedCover ?? row.cover_url);
            continue;
          }
          if (!isImageFile(coverName)) {
            continue;
          }
          if (normalizedCover) {
            storagePathSet.add(normalizedCover.toLowerCase());
            files.push({
              name: normalizedCover.split("/").pop() ?? normalizedCover,
              path: normalizedCover,
            });
          }
        }
      }
    }

    await fetchGallery(true);
    if (files.length <= 1) {
      await fetchGallery(false);
    }
  }

  files.sort((a, b) =>
    a.path.localeCompare(b.path, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  const portadaIndex = files.findIndex((file) =>
    /portada|cover/i.test(file.name),
  );
  if (portadaIndex > 0) {
    const [first] = files.splice(portadaIndex, 1);
    files.unshift(first);
  }

  const unique = new Map<string, string>();
  for (const file of files) {
    const url = toPublicStorageUrl(file.path);
    if (!url) continue;
    unique.set(url, url);
  }

  const results = Array.from(unique.values());

  if (results.length > bestImages.length) {
    bestImages = results;
  } else if (results.length === bestImages.length && results.length > 0) {
    // Prefer results that include non-portada entries
    const hasMultiple = results.length > 1;
    if (hasMultiple) {
      bestImages = results;
    }
  }

  if (bestImages.length === 0) {
    bestImages = results;
  }

  if (bestImages.length <= 1) {
    console.warn(
      `[gallery] Solo se encontró 1 imagen para "${projectName}"${comuna ? ` en ${comuna}` : ""}.`,
    );
  }

  if (!brochure && brochureCandidates.length > 0) {
    brochure = brochureCandidates[0];
  }

  return {
    images: bestImages,
    brochure,
  };
}

export { FOLDER_BY_NAME } from "@/lib/galleryFolders";
