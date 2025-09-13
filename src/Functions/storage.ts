/**
 * StorageProvider defines a flexible contract for any storage system
 * (localStorage, backend API, etc.). Swap implementations easily.
 */
export interface StorageProvider {
  /** Get a value by key, or fallback if not found. Async for backend compatibility. */
  get<T>(key: string, fallback: T): Promise<T>;
  /** Store a value by key. Async for backend compatibility. */
  set<T>(key: string, value: T): Promise<void>;
}

/**
 * localStorageProvider: uses browser localStorage for persistence.
 * Swap this out for a backend provider as needed.
 */
export const localStorageProvider: StorageProvider = {
  async get<T>(key: string, fallback: T): Promise<T> {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    try {
      return JSON.parse(saved) as T;
    } catch {
      return fallback;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

/*
Example: MongoDB/Backend implementation (pseudo-code):

export const mongoDbProvider: StorageProvider = {
  async get<T>(key: string, fallback: T): Promise<T> {
    // Fetch from your backend API, e.g.:
    // const res = await fetch(`/api/data/${key}`);
    // if (!res.ok) return fallback;
    // return await res.json() as T;
    // (Backend would handle MongoDB queries)
    return fallback;
  },
  async set<T>(key: string, value: T): Promise<void> {
    // Send to your backend API, e.g.:
    // await fetch(`/api/data/${key}`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(value)
    // });
    // (Backend would handle MongoDB updates)
  }
};
*/
