import { Settings } from "../../../Adapter/Settings/Settings.mjs";

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
     * @returns {void}
     */
    store(key, value) {
        this.#settings.store(
            key,
            JSON.stringify(value)
        );
    }
}
