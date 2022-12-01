/** @typedef {import("../../../Adapter/StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class StoreCommand {
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {StoreCommand}
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
