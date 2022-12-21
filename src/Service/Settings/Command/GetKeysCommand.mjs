/** @typedef {import("../../../Adapter/StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class GetKeysCommand {
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {GetKeysCommand}
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
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return this.#storage_implementation.getKeys();
    }
}
