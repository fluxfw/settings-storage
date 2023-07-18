/** @typedef {import("mongodb").Collection} Collection */
/** @typedef {import("../FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @param {Collection | null} mongo_db_collection
 * @param {string | null} json_file_path
 * @returns {Promise<FluxSettingsStorage>}
 */
export async function getNodeJsFluxSettingsStorage(mongo_db_collection = null, json_file_path = null) {
    try {
        if (mongo_db_collection !== null) {
            return (await import("./FluxMongoDbNodeJsSettingsStorage.mjs")).FluxMongoDbNodeJsSettingsStorage.new(
                mongo_db_collection
            );
        }
    } catch (error) {
        console.error("Try using FluxMongoDbNodeJsSettingsStorage failed (", error, ")");
    }

    try {
        if (json_file_path !== null) {
            const flux_settings_storage = (await import("./FluxJsonFileNodeJsSettingsStorage.mjs")).FluxJsonFileNodeJsSettingsStorage.new(
                json_file_path
            );

            await flux_settings_storage.init();

            return flux_settings_storage;
        }
    } catch (error) {
        console.error("Try using FluxJsonFileNodeJsSettingsStorage failed (", error, ")");
    }

    console.warn("Neither FluxMongoDbNodeJsSettingsStorage nor FluxJsonFileNodeJsSettingsStorage are available - Using FluxMemorySettingsStorage fallback");

    return (await import("../FluxMemorySettingsStorage.mjs")).FluxMemorySettingsStorage.new();
}
