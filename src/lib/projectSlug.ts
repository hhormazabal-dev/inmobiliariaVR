export function buildProjectSlug(
  name: string | null | undefined,
  comuna: string | null | undefined,
) {
  const segments = [comuna, name]
    .filter((segment): segment is string => Boolean(segment && segment.trim()))
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-"),
    )
    .filter(Boolean);

  const slug = segments
    .join("-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `proyecto-${Math.random().toString(36).slice(2, 8)}`;
}
