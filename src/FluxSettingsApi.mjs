/** @typedef {import("./StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class FluxSettingsApi {
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {FluxSettingsApi}
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
        await this.#storage_implementation.clear();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.#storage_implementation.delete(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return this.#storage_implementation.get(
            key,
            default_value
        );
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return this.#storage_implementation.getAll();
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return this.#storage_implementation.getKeys();
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return this.#storage_implementation.has(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await this.#storage_implementation.store(
            key,
            value
        );
    }
}
