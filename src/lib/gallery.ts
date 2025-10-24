import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[gallery] Falta configurar las variables de entorno de Supabase.",
  );
}

const FOLDER_BY_NAME: Record<string, string> = {
  "All Ñuñoa": "All Nunoa",
  "All Ñuñoa II": "All Nunoa II",
  "Best Level Ñuñoa": "Best Level Nunoa",
  "Best Ñuñoa": "Best Nunoa",
};

const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
        },
      })
    : null;

function resolveFolderName(projectName: string) {
  const trimmed = projectName?.trim();
  if (!trimmed) return "";
  return FOLDER_BY_NAME[trimmed] || trimmed;
}

function encodePath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/projects/${encodePath(path)}`;
}

function isImageFile(name: string) {
  return /\.(jpe?g|png|webp|gif|heic)$/i.test(name);
}

export async function listProjectImages(
  projectName: string,
): Promise<string[]> {
  if (!supabase || !SUPABASE_URL) {
    return [];
  }

  const folder = resolveFolderName(projectName);
  if (!folder) {
    return [];
  }

  const visited = new Set<string>();
  const files: { name: string; path: string }[] = [];

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

      const isDirectory = !entry.id || entry.metadata === null;
      if (isDirectory) {
        await collect(entryPath);
        continue;
      }

      if (isImageFile(entry.name)) {
        files.push({ name: entry.name, path: entryPath });
      }
    }
  }

  await collect(folder);

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
    const url = buildPublicUrl(file.path);
    unique.set(url, url);
  }

  return Array.from(unique.values());
}

export { FOLDER_BY_NAME };
