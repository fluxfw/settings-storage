/** @typedef {import("../../../Adapter/StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class GetCommand {
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {GetCommand}
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
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return await this.#storage_implementation.get(
            key
        ) ?? default_value;
    }
}
