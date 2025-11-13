import { NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { normalizeStoragePath, toPublicStorageUrl } from "@/lib/supabaseImages";
import { resolveFolderName } from "@/lib/galleryFolders";

type Entry = { name: string; path: string };

const SUPABASE_SERVICE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  "";

if (!SUPABASE_SERVICE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn(
    "[api/project-images] Missing Supabase service credentials. Fallback API disabled.",
  );
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

function isImageFile(name: string) {
  return /\.(jpe?g|png|webp|gif|heic)$/i.test(name);
}

function isPdfFile(name: string) {
  return /\.pdf$/i.test(name);
}

function folderFromPath(path: string) {
  const normalized = normalizeStoragePath(path) ?? path;
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }
  segments.pop();
  return segments.join("/");
}

async function gatherImages(
  client: SupabaseClient,
  name: string,
  comuna?: string,
  coverUrl?: string,
) {
  const files: Entry[] = [];
  const folders = new Set<string>();
  const storage = client.storage.from("projects");
  const storagePathSet = new Set<string>();
  let brochure: string | null = null;
  const setBrochureFromPath = (path: string | null | undefined) => {
    if (!path) return;
    const normalized = normalizeStoragePath(path);
    if (!normalized) return;
    const url = toPublicStorageUrl(normalized);
    if (!url) return;
    const preferred = /(?:^|\/)1\.pdf$/i.test(normalized);
    if (!brochure || preferred) {
      brochure = url;
    }
  };

  const resolvedNameFolder = resolveFolderName(name);
  if (resolvedNameFolder) {
    folders.add(resolvedNameFolder);
  }

  const { data: rows, error } = await client
    .from("projects")
    .select("name, comuna, cover_url, gallery_urls")
    .ilike("name", `%${name}%`)
    .limit(10);

  if (error && error.code !== "PGRST116") {
    console.error(
      `[api/project-images] Error fetching project rows for ${name}:`,
      error,
    );
  }

  const matches = (rows ?? []).filter((row) => {
    if (!comuna) return true;
    return row.comuna?.toLowerCase().includes(comuna.toLowerCase());
  });

  for (const row of matches) {
    const cover = row.cover_url?.trim();
    if (cover) {
      const normalizedCover = normalizeStoragePath(cover);
      if (normalizedCover) {
        folders.add(folderFromPath(cover));
        const coverName = normalizedCover.split("/").pop() ?? normalizedCover;
        if (isPdfFile(coverName)) {
          setBrochureFromPath(normalizedCover);
        } else {
          storagePathSet.add(normalizedCover.toLowerCase());
          files.push({
            name: coverName,
            path: normalizedCover,
          });
        }
      }
    }

    const resolvedFolder = resolveFolderName(row.name ?? "");
    if (resolvedFolder) {
      folders.add(resolvedFolder);
    }

    const slugName = slugify(row.name ?? "");
    if (slugName) {
      folders.add(slugName);
    }
    const slugComuna = slugify(row.comuna ?? "");
    if (slugName && slugComuna) {
      folders.add(`${slugComuna}/${slugName}`);
    }

    for (const entry of row.gallery_urls ?? []) {
      if (!entry) continue;
      const normalizedEntry = normalizeStoragePath(entry);
      const entryName =
        normalizedEntry?.split("/").pop() ?? entry.split("/").pop() ?? entry;
      if (isPdfFile(entryName)) {
        setBrochureFromPath(normalizedEntry ?? entry);
        continue;
      }
      if (/^https?:\/\//i.test(entry)) {
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
            name: entryName,
            path: normalizedEntry,
          });
        } else {
          files.push({ name: entryName, path: entry });
        }
      } else {
        const normalized = normalizeStoragePath(entry);
        if (normalized) {
          storagePathSet.add(normalized.toLowerCase());
          files.push({
            name: entryName,
            path: normalized,
          });
        } else {
          files.push({
            name: entryName,
            path: entry.replace(/^\/+/, ""),
          });
        }
      }
    }
  }

  if (coverUrl) {
    const folder = folderFromPath(coverUrl);
    if (folder) {
      folders.add(folder);
    }
    const normalizedCover = normalizeStoragePath(coverUrl);
    if (normalizedCover) {
      const coverName = normalizedCover.split("/").pop() ?? normalizedCover;
      if (isPdfFile(coverName)) {
        setBrochureFromPath(normalizedCover);
      } else {
        storagePathSet.add(normalizedCover.toLowerCase());
        files.push({
          name: coverName,
          path: normalizedCover,
        });
      }
    }
  }

  async function collectFolder(prefix: string) {
    if (!prefix) return [];
    const { data, error } = await storage.list(prefix, {
      limit: 200,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      console.error(
        `[api/project-images] Error listando carpeta ${prefix}:`,
        error,
      );
      return [];
    }

    const discovered = new Set<string>();

    for (const entry of data ?? []) {
      if (!entry?.name) continue;
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) {
        if (isPdfFile(entry.name)) {
          setBrochureFromPath(path);
          continue;
        }
        if (!isImageFile(entry.name)) continue;
        const normalized = normalizeStoragePath(path);
        if (!normalized) continue;
        const lower = normalized.toLowerCase();
        if (storagePathSet.has(lower)) continue;
        storagePathSet.add(lower);
        files.push({
          name: normalized.split("/").pop() ?? normalized,
          path: normalized,
        });
        const parent = folderFromPath(normalized);
        if (parent) {
          discovered.add(parent);
        }
      } else {
        discovered.add(path);
      }
    }

    return Array.from(discovered);
  }

  const folderQueue = Array.from(folders).filter(Boolean);
  const processed = new Set<string>();

  while (folderQueue.length > 0) {
    const folder = folderQueue.shift();
    if (!folder || processed.has(folder)) continue;
    processed.add(folder);

    const newlyFound = await collectFolder(folder);
    for (const newFolder of newlyFound) {
      if (!processed.has(newFolder)) {
        folderQueue.push(newFolder);
      }
    }
  }

  const unique = new Map<string, string>();
  for (const file of files) {
    const normalized = toPublicStorageUrl(file.path);
    if (!normalized) continue;
    unique.set(normalized, normalized);
  }

  const result = Array.from(unique.values());
  console.log(
    `[api/project-images] ${name} (${comuna ?? "s/comuna"}) -> folders:${
      folders.size
    } files:${files.length} unique:${result.length}`,
  );
  return { images: result, brochure };
}

export async function GET(request: Request) {
  if (!SUPABASE_SERVICE_URL || !SUPABASE_SERVICE_KEY) {
    return NextResponse.json(
      { images: [], error: "Supabase service credentials not configured." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();
  const comuna = searchParams.get("comuna")?.trim();
  const coverUrl = searchParams.get("coverUrl")?.trim();

  if (!name) {
    return NextResponse.json(
      { images: [], error: "Missing project name." },
      { status: 400 },
    );
  }

  const client = createClient(SUPABASE_SERVICE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });

  try {
    const { images, brochure } = await gatherImages(
      client,
      name,
      comuna,
      coverUrl,
    );
    return NextResponse.json({ images, brochure });
  } catch (error) {
    console.error("[api/project-images] Unexpected error:", error);
    return NextResponse.json(
      { images: [], error: "Unexpected error listing images." },
      { status: 500 },
    );
  }
}
