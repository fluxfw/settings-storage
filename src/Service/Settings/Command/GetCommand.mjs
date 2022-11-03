/** @typedef {import("../../../Adapter/Settings/Settings.mjs").Settings} Settings */

export class GetCommand {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {GetCommand}
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
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        const value = await this.#settings.get(
            key
        );

        if (value === null) {
            return default_value;
        }

        return JSON.parse(value);
    }
}
