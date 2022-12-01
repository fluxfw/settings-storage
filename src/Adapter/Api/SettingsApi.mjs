/** @typedef {import("../../Service/Settings/Port/SettingsService.mjs").SettingsService} SettingsService */
/** @typedef {import("../StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class SettingsApi {
    /**
     * @type {SettingsService | null}
     */
    #settings_service = null;
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {SettingsApi}
     */
    static new(storage_implementation) {
        return new this(
            storage_implementation
        );
    }

    /**
     * @param {StorageImplementation} storage_implementation
     * @private
     */
    constructor(storage_implementation) {
        this.#storage_implementation = storage_implementation;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        await (await this.#getSettingsService()).clear();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await (await this.#getSettingsService()).delete(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return (await this.#getSettingsService()).get(
            key,
            default_value
        );
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return (await this.#getSettingsService()).getAll();
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return (await this.#getSettingsService()).has(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await (await this.#getSettingsService()).store(
            key,
            value
        );
    }

    /**
     * @returns {Promise<SettingsService>}
     */
    async #getSettingsService() {
        this.#settings_service ??= (await import("../../Service/Settings/Port/SettingsService.mjs")).SettingsService.new(
            this.#storage_implementation
        );

        return this.#settings_service;
    }
}
