import { Settings } from "../../../Adapter/Settings/Settings.mjs";

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
     * @returns {*}
     */
    get(key, default_value = null) {
        const value = this.#settings.get(
            key
        );

        if (value === null) {
            return default_value;
        }

        return JSON.parse(value);
    }
}
