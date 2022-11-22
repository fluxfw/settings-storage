/** @typedef {import("../../../Adapter/Implementation/Implementation.mjs").Implementation} Implementation */

export class GetAllCommand {
    /**
     * @type {Implementation}
     */
    #implementation;

    /**
     * @param {Implementation} implementation
     * @returns {GetAllCommand}
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
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return this.#implementation.getAll();
    }
}
