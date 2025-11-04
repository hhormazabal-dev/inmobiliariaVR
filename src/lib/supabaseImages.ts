const RAW_PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  process.env.SUPABASE_PROJECT_URL ||
  "";

const SUPABASE_BASE = (() => {
  if (!RAW_PUBLIC_URL) return null;
  try {
    return new URL(RAW_PUBLIC_URL);
  } catch {
    return null;
  }
})();

export function normalizeStoragePath(input?: string | null) {
  if (!input) return null;

  let stripped = input
    .replace(/^https?:\/\/[^/]+\/storage\/v1\/object\/public\/?/i, "")
    .replace(/^\/+/, "")
    .replace(/^storage\/v1\/object\/public\/?/i, "");

  while (/^projects?\//i.test(stripped)) {
    stripped = stripped.replace(/^projects?\//i, "");
  }

  const segments = stripped
    .split("/")
    .filter(Boolean)
    .map((segment) => {
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    });

  return segments.length > 0 ? segments.join("/") : null;
}

function encodeSegments(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function toPublicStorageUrl(input?: string | null) {
  if (!input) return null;

  if (/^data:/i.test(input)) {
    return input;
  }

  if (/^https?:\/\//i.test(input)) {
    try {
      const parsed = new URL(input);
      const matchesSupabase =
        SUPABASE_BASE && parsed.host === SUPABASE_BASE.host;

      if (!matchesSupabase && parsed.hostname !== "tu_bucket") {
        return parsed.toString();
      }

      if (!SUPABASE_BASE) {
        return null;
      }

      const normalized = normalizeStoragePath(parsed.pathname);
      if (!normalized) {
        return null;
      }

      return `${SUPABASE_BASE.origin}/storage/v1/object/public/projects/${encodeSegments(normalized)}`;
    } catch {
      return null;
    }
  }

  if (!SUPABASE_BASE) {
    return null;
  }

  const normalized = normalizeStoragePath(input);
  if (!normalized) return null;

  return `${SUPABASE_BASE.origin}/storage/v1/object/public/projects/${encodeSegments(normalized)}`;
}
