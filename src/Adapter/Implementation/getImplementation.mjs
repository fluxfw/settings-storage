/** @typedef {import("./Implementation.mjs").Implementation} Implementation */

/**
 * @param {string | null} indexeddb_database_name
 * @param {string | null} indexeddb_store_name
 * @param {string | null} storage_key_prefix
 * @param {string | null} cache_cache_name
 * @returns {Promise<Implementation>}
 */
export async function getImplementation(indexeddb_database_name = null, indexeddb_store_name = null, storage_key_prefix = null, cache_cache_name = null) {
    try {
        if (indexeddb_database_name !== null && indexeddb_store_name !== null && (globalThis.indexedDB?.open ?? null) !== null) {
            return (await import("./IndexedDBImplementation.mjs")).IndexedDBImplementation.new(
                indexeddb_database_name,
                indexeddb_store_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (storage_key_prefix !== null && (globalThis.localStorage ?? null) !== null) {
            return (await import("./StorageImplementation.mjs")).StorageImplementation.new(
                storage_key_prefix,
                localStorage
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (cache_cache_name !== null && (globalThis.caches?.open ?? null) !== null) {
            return (await import("./CacheImplementation.mjs")).CacheImplementation.new(
                cache_cache_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    console.warn("Neither IndexedDBImplementation nor StorageImplementation nor CacheImplementation are available - Using MemoryImplementation fallback");

    return (await import("./MemoryImplementation.mjs")).MemoryImplementation.new();
}
