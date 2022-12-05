/** @typedef {import("mongodb").Collection} Collection */
/** @typedef {import("./StorageImplementation.mjs").StorageImplementation} StorageImplementation */

/**
 * @param {string | null} json_file_path
 * @param {Collection | null} mongo_db_collection
 * @returns {Promise<StorageImplementation>}
 */
export async function getNodeJsStorageImplementation(json_file_path = null, mongo_db_collection = null) {
    try {
        if (json_file_path !== null) {
            return (await import("./NodeJs/JsonFileNodeJsStorageImplementation.mjs")).JsonFileNodeJsStorageImplementation.new(
                json_file_path
            );
        }
    } catch (error) {
        console.error(error);
    }

    try {
        if (mongo_db_collection !== null) {
            return (await import("./NodeJs/MongoDbNodeJsStorageImplementation.mjs")).MongoDbNodeJsStorageImplementation.new(
                mongo_db_collection
            );
        }
    } catch (error) {
        console.error(error);
    }

    console.warn("Neither JsonFileNodeJsStorageImplementation nor MongoDbNodeJsStorageImplementation are available - Using MemoryStorageImplementation fallback");

    return (await import("./MemoryStorageImplementation.mjs")).MemoryStorageImplementation.new();
}
