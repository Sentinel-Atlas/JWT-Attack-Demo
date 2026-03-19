export function formatUnixTimestamp(value?: number): string {
  if (typeof value !== "number") return "—";
  return new Date(value * 1000).toLocaleString();
}

export function timeAgoFromUnix(value?: number): string {
  if (typeof value !== "number") return "—";
  const diff = Math.floor(Date.now() / 1000) - value;
  const days = Math.floor(diff / 86400);
  if (days > 0) return `${days}d ago`;
  const hours = Math.floor(diff / 3600);
  if (hours > 0) return `${hours}h ago`;
  return `${Math.max(0, Math.floor(diff / 60))}m ago`;
}

export function bytesToHex(str: string): string {
  return Array.from(str)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}
