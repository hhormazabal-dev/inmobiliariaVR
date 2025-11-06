import { toPublicStorageUrl } from "@/lib/supabaseImages";

export function resolveImageAsset(input?: string | null) {
  if (!input) return null;
  if (/^(\/|data:)/.test(input)) {
    return input;
  }
  const fromStorage = toPublicStorageUrl(input);
  if (fromStorage) {
    return fromStorage;
  }
  if (/^https?:\/\//i.test(input)) {
    return input;
  }
  return null;
}
