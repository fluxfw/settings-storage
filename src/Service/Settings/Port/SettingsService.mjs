/** @typedef {import("../../../Adapter/Implementation/Implementation.mjs").Implementation} Implementation */

export class SettingsService {
    /**
     * @type {Implementation}
     */
    #implementation;

    /**
     * @param {Implementation} implementation
     * @returns {SettingsService}
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
     * @returns {Promise<void>}
     */
    async clear() {
        await (await import("../Command/ClearCommand.mjs")).ClearCommand.new(
            this.#implementation
        )
            .clear();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await (await import("../Command/DeleteCommand.mjs")).DeleteCommand.new(
            this.#implementation
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
            this.#implementation
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
            this.#implementation
        ).getAll();
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return (await import("../Command/HasCommand.mjs")).HasCommand.new(
            this.#implementation
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
            this.#implementation
        )
            .store(
                key,
                value
            );
    }
}
