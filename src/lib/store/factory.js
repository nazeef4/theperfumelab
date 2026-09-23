import { FileStore } from "./file";
import { MongoStore } from "./mongo";
import { ensureSeeded } from "../seed";

let _store = null;
let _init = null;

/**
 * Returns the application data store.
 *
 * - When MONGODB_URI is configured → MongoDB (Mongoose). Recommended for production.
 * - Otherwise → a zero-setup file store under ./.data (great for local demo).
 */
export async function getStore() {
  if (_store) return _store;
  if (!_init) {
    _init = (async () => {
      let store;
      if (process.env.MONGODB_URI) {
        store = new MongoStore(process.env.MONGODB_URI);
        await store.init();
        console.log("[store] Connected to MongoDB ✔");
      } else {
        store = new FileStore();
        await store.init();
        console.log(`[store] MONGODB_URI not set — using built-in file store at ${store.dir}`);
      }
      await ensureSeeded(store);
      _store = store;
      return store;
    })().catch((err) => {
      _init = null;
      throw err;
    });
  }
  return _init;
}
