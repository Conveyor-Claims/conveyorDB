export function hasStoragePath(
  path: string | null | undefined,
): path is string {
  return typeof path === "string" && path.trim() !== "";
}

export function slotFilledMessage(slotName: string): string {
  return `Slot "${slotName}" is already filled for this case. The existing file was not replaced.`;
}

export function fileNameFromPath(path: string | null): string {
  if (!hasStoragePath(path)) return "";
  const parts = path.split("/").filter((part) => part.length > 0);
  return parts[parts.length - 1] ?? path;
}

export function safeFileName(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").trim();
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned || "file";
}
