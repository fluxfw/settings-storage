/** @typedef {import("../../../Adapter/Implementation/Implementation.mjs").Implementation} Implementation */

export class DeleteCommand {
    /**
     * @type {Implementation}
     */
    #implementation;

    /**
     * @param {Implementation} implementation
     * @returns {DeleteCommand}
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
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.#implementation.delete(
            key
        );
    }
}
