/** @typedef {import("../../../Adapter/StorageImplementation/StorageImplementation.mjs").StorageImplementation} StorageImplementation */

export class HasCommand {
    /**
     * @type {StorageImplementation}
     */
    #storage_implementation;

    /**
     * @param {StorageImplementation} storage_implementation
     * @returns {HasCommand}
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
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return this.#storage_implementation.has(
            key
        );
    }
}
