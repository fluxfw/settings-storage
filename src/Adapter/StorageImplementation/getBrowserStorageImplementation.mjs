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
            return (await import("./Browser/IndexedDBBrowserStorageImplementation.mjs")).IndexedDBBrowserStorageImplementation.new(
                indexeddb_database_name,
                indexeddb_store_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (cache_cache_name !== null && (globalThis.caches?.open ?? null) !== null) {
            return (await import("./Browser/CacheBrowserStorageImplementation.mjs")).CacheBrowserStorageImplementation.new(
                cache_cache_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (storage_key_prefix !== null && (globalThis.localStorage ?? null) !== null) {
            console.warn("Using StorageStorageImplementation, big/mutch data may not work");

            return (await import("./Browser/StorageBrowserStorageImplementation.mjs")).StorageBrowserStorageImplementation.new(
                storage_key_prefix,
                localStorage
            );
        }
    } catch (error) {
        console.error(error);
    }

    console.warn("Neither IndexedDBBrowserStorageImplementation nor CacheBrowserStorageImplementation nor StorageBrowserStorageImplementation are available - Using MemoryStorageImplementation fallback");

    return (await import("./MemoryStorageImplementation.mjs")).MemoryStorageImplementation.new();
}
