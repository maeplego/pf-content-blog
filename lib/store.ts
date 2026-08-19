import type { Post, PostStatus } from "./visibility";

export type PostInput = {
  title: string;
  slug: string;
  bodyMd: string;
  tags: string[];
  coverUrl: string;
  author: string;
  status: PostStatus;
};

export interface PostStore {
  ping(): Promise<void>;
  listAll(): Promise<Post[]>;
  listPublic(now: Date): Promise<Post[]>;
  bySlug(slug: string): Promise<Post | null>;
  byId(id: string): Promise<Post | null>;
  create(input: PostInput, now: Date, id: string): Promise<Post>;
  update(id: string, input: Partial<PostInput>, now: Date): Promise<Post>;
}
