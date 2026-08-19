import { memoryStore, newId } from "./memory";
import { postgresStore } from "./postgres";
import type { PostStore } from "./store";
import { seedIfEmpty } from "./seed";

const g = globalThis as typeof globalThis & { __contentReady?: Promise<PostStore> };

export async function getStore(): Promise<PostStore> {
  if (!g.__contentReady) {
    g.__contentReady = (async () => {
      const url = process.env.CONTENT_DATABASE_URL?.trim();
      const store = url ? await postgresStore(url) : memoryStore();
      await seedIfEmpty(store);
      return store;
    })();
  }
  return g.__contentReady;
}
