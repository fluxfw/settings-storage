/** @typedef {import("../../../Adapter/StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class SettingsService {
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {SettingsService}
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
        await (await import("../Command/ClearCommand.mjs")).ClearCommand.new(
            this.#storage_implementation
        )
            .clear();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await (await import("../Command/DeleteCommand.mjs")).DeleteCommand.new(
            this.#storage_implementation
        )
            .delete(
                key
            );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return (await import("../Command/GetCommand.mjs")).GetCommand.new(
            this.#storage_implementation
        )
            .get(
                key,
                default_value
            );
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return (await import("../Command/GetAllCommand.mjs")).GetAllCommand.new(
            this.#storage_implementation
        ).getAll();
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return (await import("../Command/HasCommand.mjs")).HasCommand.new(
            this.#storage_implementation
        ).has(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await (await import("../Command/StoreCommand.mjs")).StoreCommand.new(
            this.#storage_implementation
        )
            .store(
                key,
                value
            );
    }
}
