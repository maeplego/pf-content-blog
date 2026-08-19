import { ulid } from "ulid";
import { assertSlug } from "./slug";
import type { PostInput, PostStore } from "./store";
import { isPublic, publish, unpublish, type Post, type PostStatus } from "./visibility";

class MemoryStore implements PostStore {
  private posts = new Map<string, Post>();

  async ping(): Promise<void> {}

  async listAll(): Promise<Post[]> {
    return [...this.posts.values()].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async listPublic(now: Date): Promise<Post[]> {
    return (await this.listAll()).filter((p) => isPublic(p, now));
  }

  async bySlug(slug: string): Promise<Post | null> {
    return [...this.posts.values()].find((p) => p.slug === slug) ?? null;
  }

  async byId(id: string): Promise<Post | null> {
    return this.posts.get(id) ?? null;
  }

  async create(input: PostInput, now: Date, id: string): Promise<Post> {
    if (await this.bySlug(input.slug)) {
      throw Object.assign(new Error("slug already exists"), { status: 409 });
    }
    const post: Post = {
      id,
      slug: input.slug,
      title: input.title,
      bodyMd: input.bodyMd,
      status: input.status,
      tags: input.tags,
      coverUrl: input.coverUrl,
      author: input.author,
      createdAt: now,
      updatedAt: now,
      publishedAt: input.status === "published" ? now : null,
    };
    this.posts.set(id, post);
    return post;
  }

  async update(id: string, input: Partial<PostInput>, now: Date): Promise<Post> {
    const cur = this.posts.get(id);
    if (!cur) throw Object.assign(new Error("not found"), { status: 404 });
    if (input.slug && input.slug !== cur.slug && (await this.bySlug(input.slug))) {
      throw Object.assign(new Error("slug already exists"), { status: 409 });
    }
    let next: Post = {
      ...cur,
      title: input.title ?? cur.title,
      slug: input.slug ?? cur.slug,
      bodyMd: input.bodyMd ?? cur.bodyMd,
      tags: input.tags ?? cur.tags,
      coverUrl: input.coverUrl ?? cur.coverUrl,
      author: input.author ?? cur.author,
      updatedAt: now,
    };
    if (input.status === "published" && cur.status !== "published") {
      next = publish(next, now);
    } else if (input.status === "draft" && cur.status === "published") {
      next = unpublish(next, now);
    } else if (input.status) {
      next = { ...next, status: input.status };
    }
    this.posts.set(id, next);
    return next;
  }
}

export function newId(): string {
  return ulid();
}

export function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export function parseStatus(raw: unknown, fallback: PostStatus): PostStatus {
  if (raw === "draft" || raw === "published") return raw;
  return fallback;
}

export function validateInput(body: Record<string, unknown>, fallbackStatus: PostStatus): PostInput {
  const title = String(body.title ?? "").trim();
  if (!title) throw Object.assign(new Error("title is required"), { status: 400 });
  const slug = assertSlug(String(body.slug ?? title));
  const bodyMd = String(body.bodyMd ?? "");
  if (!bodyMd.trim()) throw Object.assign(new Error("bodyMd is required"), { status: 400 });
  return {
    title,
    slug,
    bodyMd,
    tags: parseTags(body.tags),
    coverUrl: String(body.coverUrl ?? "/harbor.svg"),
    author: String(body.author ?? "Demo Author").trim() || "Demo Author",
    status: parseStatus(body.status, fallbackStatus),
  };
}

const g = globalThis as typeof globalThis & { __contentStore?: PostStore };

export function memoryStore(): PostStore {
  if (!g.__contentStore) g.__contentStore = new MemoryStore();
  return g.__contentStore;
}
