/** @typedef {import("../../../Adapter/Settings/Settings.mjs").Settings} Settings */

export class SettingsService {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {SettingsService}
     */
    static new(settings) {
        return new this(
            settings
        );
    }

    /**
     * @param {Settings} settings
     * @private
     */
    constructor(settings) {
        this.#settings = settings;
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await (await import("../Command/DeleteCommand.mjs")).DeleteCommand.new(
            this.#settings
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
            this.#settings
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
            this.#settings
        ).getAll();
    }

    /**
     * @returns {Promise<void>}
     */
    async reset() {
        await (await import("../Command/ResetCommand.mjs")).ResetCommand.new(
            this.#settings
        )
            .reset();
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await (await import("../Command/StoreCommand.mjs")).StoreCommand.new(
            this.#settings
        )
            .store(
                key,
                value
            );
    }
}
