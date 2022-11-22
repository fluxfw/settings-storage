/** @typedef {import("./Implementation.mjs").Implementation} Implementation */

/**
 * @param {string} indexdb_database_name
 * @param {string} indexdb_store_name
 * @param {string} storage_key_prefix
 * @returns {Promise<Implementation>}
 */
export async function getImplementation(indexdb_database_name, indexdb_store_name, storage_key_prefix) {
    try {
        if ((indexedDB ?? null) !== null && (indexedDB.open ?? null) !== null) {
            return (await import("./IndexedDBImplementation.mjs")).IndexedDBImplementation.new(
                indexdb_database_name,
                indexdb_store_name
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if ((localStorage ?? null) !== null) {
            return (await import("./StorageImplementation.mjs")).StorageImplementation.new(
                storage_key_prefix,
                localStorage
            );
        }
    } catch (error) {
        console.error(error);
    }

    console.warn("Unavailable IndexedDBImplementation or StorageImplementation - Using MemoryImplementation fallback");

    return (await import("./MemoryImplementation.mjs")).MemoryImplementation.new();
}
