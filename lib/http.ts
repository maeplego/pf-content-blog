import type { Post } from "./visibility";

export function postJSON(p: Post) {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    bodyMd: p.bodyMd,
    status: p.status,
    tags: p.tags,
    coverUrl: p.coverUrl,
    author: p.author,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() ?? null,
  };
}

export function errorStatus(err: unknown): { status: number; message: string } {
  const e = err as { status?: number; message?: string };
  return { status: e.status ?? 400, message: e.message ?? "error" };
}
