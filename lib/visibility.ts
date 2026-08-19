export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  bodyMd: string;
  status: PostStatus;
  tags: string[];
  coverUrl: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

export function isPublic(post: Pick<Post, "status" | "publishedAt">, now: Date): boolean {
  if (post.status !== "published") return false;
  if (!post.publishedAt) return false;
  return post.publishedAt.getTime() <= now.getTime();
}

export function publish(post: Post, now: Date): Post {
  return {
    ...post,
    status: "published",
    publishedAt: post.publishedAt ?? now,
    updatedAt: now,
  };
}

export function unpublish(post: Post, now: Date): Post {
  return { ...post, status: "draft", updatedAt: now };
}

/** Public URL may show a draft only when Next.js Draft Mode is on *and* the viewer is an editor. */
export function canReadPost(
  post: Pick<Post, "status" | "publishedAt">,
  now: Date,
  opts: { draftMode: boolean; editor: boolean },
): boolean {
  if (isPublic(post, now)) return true;
  return opts.draftMode && opts.editor;
}
