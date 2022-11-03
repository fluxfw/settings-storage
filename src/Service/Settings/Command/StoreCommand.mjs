/** @typedef {import("../../../Adapter/Settings/Settings.mjs").Settings} Settings */

export class StoreCommand {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {StoreCommand}
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
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await this.#settings.store(
            key,
            JSON.stringify(value)
        );
    }
}
