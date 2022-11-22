/** @typedef {import("../../../Adapter/Implementation/Implementation.mjs").Implementation} Implementation */

export class HasCommand {
    /**
     * @type {Implementation}
     */
    #implementation;

    /**
     * @param {Implementation} implementation
     * @returns {HasCommand}
     */
    static new(implementation) {
        return new this(
            implementation
        );
    }

    /**
     * @param {Implementation} implementation
     * @private
     */
    constructor(implementation) {
        this.#implementation = implementation;
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return this.#implementation.has(
            key
        );
    }
}
