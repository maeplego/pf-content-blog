import { Pool } from "pg";
import { isPublic, publish, unpublish, type Post, type PostStatus } from "./visibility";
import type { PostInput, PostStore } from "./store";

const schema = `
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  tags TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ
);
`;

function rowToPost(r: {
  id: string;
  slug: string;
  title: string;
  body_md: string;
  status: PostStatus;
  tags: string;
  cover_url: string;
  author: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}): Post {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    bodyMd: r.body_md,
    status: r.status,
    tags: r.tags ? r.tags.split(",").filter(Boolean) : [],
    coverUrl: r.cover_url,
    author: r.author,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    publishedAt: r.published_at,
  };
}

export class PostgresStore implements PostStore {
  constructor(private pool: Pool) {}

  async migrate(): Promise<void> {
    await this.pool.query(schema);
  }

  async ping(): Promise<void> {
    await this.pool.query("SELECT 1");
  }

  async listAll(): Promise<Post[]> {
    const { rows } = await this.pool.query(`SELECT * FROM posts ORDER BY updated_at DESC`);
    return rows.map(rowToPost);
  }

  async listPublic(now: Date): Promise<Post[]> {
    const all = await this.listAll();
    return all.filter((p) => isPublic(p, now));
  }

  async bySlug(slug: string): Promise<Post | null> {
    const { rows } = await this.pool.query(`SELECT * FROM posts WHERE slug = $1`, [slug]);
    return rows[0] ? rowToPost(rows[0]) : null;
  }

  async byId(id: string): Promise<Post | null> {
    const { rows } = await this.pool.query(`SELECT * FROM posts WHERE id = $1`, [id]);
    return rows[0] ? rowToPost(rows[0]) : null;
  }

  async create(input: PostInput, now: Date, id: string): Promise<Post> {
    const publishedAt = input.status === "published" ? now : null;
    try {
      const { rows } = await this.pool.query(
        `INSERT INTO posts (id, slug, title, body_md, status, tags, cover_url, author, created_at, updated_at, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9,$10) RETURNING *`,
        [
          id,
          input.slug,
          input.title,
          input.bodyMd,
          input.status,
          input.tags.join(","),
          input.coverUrl,
          input.author,
          now,
          publishedAt,
        ],
      );
      return rowToPost(rows[0]);
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      if (code === "23505") throw Object.assign(new Error("slug already exists"), { status: 409 });
      throw e;
    }
  }

  async update(id: string, input: Partial<PostInput>, now: Date): Promise<Post> {
    const cur = await this.byId(id);
    if (!cur) throw Object.assign(new Error("not found"), { status: 404 });
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
    try {
      const { rows } = await this.pool.query(
        `UPDATE posts SET slug=$2, title=$3, body_md=$4, status=$5, tags=$6, cover_url=$7, author=$8, updated_at=$9, published_at=$10
         WHERE id=$1 RETURNING *`,
        [
          id,
          next.slug,
          next.title,
          next.bodyMd,
          next.status,
          next.tags.join(","),
          next.coverUrl,
          next.author,
          next.updatedAt,
          next.publishedAt,
        ],
      );
      return rowToPost(rows[0]);
    } catch (e: unknown) {
      const code = (e as { code?: string }).code;
      if (code === "23505") throw Object.assign(new Error("slug already exists"), { status: 409 });
      throw e;
    }
  }
}

const g = globalThis as typeof globalThis & { __contentPg?: PostgresStore };

export async function postgresStore(url: string): Promise<PostStore> {
  if (!g.__contentPg) {
    const pool = new Pool({ connectionString: url });
    const st = new PostgresStore(pool);
    await st.migrate();
    g.__contentPg = st;
  }
  return g.__contentPg;
}
