export function extractSlug(url) {
  const match = url.match(/problems\/([a-z0-9-]+)/i);
  return match ? match[1] : null;
}
