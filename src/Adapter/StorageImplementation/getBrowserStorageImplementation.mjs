/** @typedef {import("./StorageImplementation.mjs").StorageImplementation} StorageImplementation */

/**
 * @param {string | null} indexeddb_database_name
 * @param {string | null} indexeddb_store_name
 * @param {string | null} cache_cache_name
 * @param {string | null} storage_key_prefix
 * @returns {Promise<StorageImplementation>}
 */
export async function getBrowserStorageImplementation(indexeddb_database_name = null, indexeddb_store_name = null, cache_cache_name = null, storage_key_prefix = null) {
    try {
        if (indexeddb_database_name !== null && indexeddb_store_name !== null && (globalThis.indexedDB?.open ?? null) !== null) {
            const storage_implementation = (await import("./Browser/IndexedDBBrowserStorageImplementation.mjs")).IndexedDBBrowserStorageImplementation.new(
                indexeddb_database_name,
                indexeddb_store_name
            );
            await storage_implementation.init();
            return storage_implementation;
        }
    } catch (error) {
        console.error("Try using IndexedDBBrowserStorageImplementation failed (", error, ")");
    }

    try {
        if (cache_cache_name !== null && (globalThis.caches?.open ?? null) !== null) {
            const storage_implementation = (await import("./Browser/CacheBrowserStorageImplementation.mjs")).CacheBrowserStorageImplementation.new(
                cache_cache_name
            );
            await storage_implementation.init();
            return storage_implementation;
        }
    } catch (error) {
        console.error("Try using CacheBrowserStorageImplementation failed (", error, ")");
    }

    try {
        if (storage_key_prefix !== null && (globalThis.localStorage ?? null) !== null) {
            console.warn("Using StorageStorageImplementation - Big/mutch data may not work");

            return (await import("./Browser/StorageBrowserStorageImplementation.mjs")).StorageBrowserStorageImplementation.new(
                storage_key_prefix,
                localStorage
            );
        }
    } catch (error) {
        console.error("Try using StorageBrowserStorageImplementation failed (", error, ")");
    }

    console.warn("Neither IndexedDBBrowserStorageImplementation nor CacheBrowserStorageImplementation nor StorageBrowserStorageImplementation are available - Using MemoryStorageImplementation fallback");

    return (await import("./MemoryStorageImplementation.mjs")).MemoryStorageImplementation.new();
}
