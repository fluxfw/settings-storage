/** @typedef {import("../FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @param {string | null} indexeddb_database_name
 * @param {string | null} indexeddb_store_name
 * @param {string | null} cache_cache_name
 * @param {string | null} storage_key_prefix
 * @returns {Promise<FluxSettingsStorage>}
 */
export async function getBrowserFluxSettingsStorage(indexeddb_database_name = null, indexeddb_store_name = null, cache_cache_name = null, storage_key_prefix = null) {
    try {
        if (indexeddb_database_name !== null && indexeddb_store_name !== null && (globalThis.indexedDB?.open ?? null) !== null) {
            const flux_settings_storage = (await import("./FluxIndexedDBBrowserSettingsStorage.mjs")).FluxIndexedDBBrowserSettingsStorage.new(
                indexeddb_database_name,
                indexeddb_store_name
            );

            await flux_settings_storage.init();

            return flux_settings_storage;
        }
    } catch (error) {
        console.error("Try using FluxIndexedDBBrowserSettingsStorage failed (", error, ")");
    }

    try {
        if (cache_cache_name !== null && (globalThis.caches?.open ?? null) !== null) {
            const flux_settings_storage = (await import("./FluxCacheBrowserSettingsStorage.mjs")).FluxCacheBrowserSettingsStorage.new(
                cache_cache_name
            );

            await flux_settings_storage.init();

            return flux_settings_storage;
        }
    } catch (error) {
        console.error("Try using FluxCacheBrowserSettingsStorage failed (", error, ")");
    }

    try {
        if (storage_key_prefix !== null && (globalThis.localStorage ?? null) !== null) {
            console.warn("Using StorageFluxSettingsStorage - Big/mutch data may not work");

            return (await import("./FluxStorageBrowserSettingsStorage.mjs")).FluxStorageBrowserSettingsStorage.new(
                storage_key_prefix,
                localStorage
            );
        }
    } catch (error) {
        console.error("Try using FluxStorageBrowserSettingsStorage failed (", error, ")");
    }

    console.warn("Neither FluxIndexedDBBrowserSettingsStorage nor FluxCacheBrowserSettingsStorage nor FluxStorageBrowserSettingsStorage are available - Using FluxMemorySettingsStorage fallback");

    return (await import("../FluxMemorySettingsStorage.mjs")).FluxMemorySettingsStorage.new();
}
