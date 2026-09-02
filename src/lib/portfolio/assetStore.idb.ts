import type { AssetStore } from "./repository";
import type { AssetId } from "./types";

/**
 * Almacén de binarios sobre IndexedDB.
 *
 * Por qué IndexedDB y no localStorage: localStorage sólo guarda strings y tiene
 * un techo de ~5 MB por origen. Un GIF de fondo tranquilamente pesa 3–8 MB, y
 * pasarlo a base64 para meterlo en localStorage lo infla otro 33%: reventaría
 * la cuota con un solo fondo. IndexedDB guarda `Blob` nativo y tiene una cuota
 * mucho mayor (cientos de MB, según espacio libre en disco).
 */

const DB_NAME = "portafolio-assets";
const DB_VERSION = 1;
const STORE = "assets";

type AssetRecord = {
  id: AssetId;
  blob: Blob;
  type: string;
  createdAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Envuelve una transacción de IndexedDB en una promesa. */
function tx<T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const request = run(transaction.objectStore(STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function newId(): AssetId {
  return `asset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export class IdbAssetStore implements AssetStore {
  async put(file: Blob): Promise<AssetId> {
    const db = await openDb();
    const record: AssetRecord = {
      id: newId(),
      blob: file,
      type: file.type,
      createdAt: Date.now(),
    };

    try {
      await tx(db, "readwrite", (store) => store.put(record));
      return record.id;
    } finally {
      db.close();
    }
  }

  async getUrl(id: AssetId): Promise<string | null> {
    const db = await openDb();
    try {
      const record = await tx<AssetRecord | undefined>(db, "readonly", (store) => store.get(id));
      if (!record) return null;
      return URL.createObjectURL(record.blob);
    } finally {
      db.close();
    }
  }

  /** Las object URL viven hasta que se revocan; hay que soltarlas al desmontar. */
  release(url: string): void {
    if (url.startsWith("blob:")) URL.revokeObjectURL(url);
  }

  async delete(id: AssetId): Promise<void> {
    const db = await openDb();
    try {
      await tx(db, "readwrite", (store) => store.delete(id));
    } finally {
      db.close();
    }
  }

  /** Vacía el almacén entero. Lo usa "Restablecer" del panel de edición. */
  async clear(): Promise<void> {
    const db = await openDb();
    try {
      await tx(db, "readwrite", (store) => store.clear());
    } finally {
      db.close();
    }
  }
}
