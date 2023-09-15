import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxDefaultModuleSettingsStorage {
    /**
     * @type {string}
     */
    #default_module;
    /**
     * @type {FluxSettingsStorage}
     */
    #flux_settings_storage;

    /**
     * @param {FluxSettingsStorage} flux_settings_storage
     * @param {string | null} default_module
     * @returns {FluxDefaultModuleSettingsStorage}
     */
    static new(flux_settings_storage, default_module = null) {
        return new this(
            flux_settings_storage,
            default_module ?? DEFAULT_MODULE
        );
    }

    /**
     * @param {FluxSettingsStorage} flux_settings_storage
     * @param {string} default_module
     * @private
     */
    constructor(flux_settings_storage, default_module) {
        this.#flux_settings_storage = flux_settings_storage;
        this.#default_module = default_module;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return this.#flux_settings_storage.canStore();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#flux_settings_storage.delete(
            key,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        await this.#flux_settings_storage.deleteAll(
            this.#getModule(
                module
            )
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        await this.#flux_settings_storage.deleteAllModules();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return this.#flux_settings_storage.get(
            key,
            default_value,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAll(module = null) {
        return this.#flux_settings_storage.getAll(
            this.#getModule(
                module
            )
        );
    }

    /**
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAllModules() {
        return this.#flux_settings_storage.getAllModules();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#flux_settings_storage.has(
            key,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        await this.#flux_settings_storage.store(
            key,
            value,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        await this.#flux_settings_storage.storeAll(
            values
        );
    }

    /**
     * @param {string| null} module
     * @returns {string}
     */
    #getModule(module) {
        return module ?? this.#default_module;
    }
}
