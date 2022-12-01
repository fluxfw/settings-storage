/** @typedef {import("./StorageImplementation.mjs").StorageImplementation} StorageImplementation */

/**
 * @param {string | null} indexeddb_database_name
 * @param {string | null} indexeddb_store_name
 * @param {string | null} storage_key_prefix
 * @param {string | null} cache_cache_name
 * @returns {Promise<StorageImplementation>}
 */
export async function getStorageImplementation(indexeddb_database_name = null, indexeddb_store_name = null, storage_key_prefix = null, cache_cache_name = null) {
    try {
        if (indexeddb_database_name !== null && indexeddb_store_name !== null && (globalThis.indexedDB?.open ?? null) !== null) {
            return (await import("./IndexedDBStorageImplementation.mjs")).IndexedDBStorageImplementation.new(
                indexeddb_database_name,
                indexeddb_store_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (storage_key_prefix !== null && (globalThis.localStorage ?? null) !== null) {
            return (await import("./StorageStorageImplementation.mjs")).StorageStorageImplementation.new(
                storage_key_prefix,
                localStorage
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (cache_cache_name !== null && (globalThis.caches?.open ?? null) !== null) {
            return (await import("./CacheStorageImplementation.mjs")).CacheStorageImplementation.new(
                cache_cache_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    console.warn("Neither IndexedDBStorageImplementation nor StorageStorageImplementation nor CacheStorageImplementation are available - Using MemoryStorageImplementation fallback");

    return (await import("./MemoryStorageImplementation.mjs")).MemoryStorageImplementation.new();
}
