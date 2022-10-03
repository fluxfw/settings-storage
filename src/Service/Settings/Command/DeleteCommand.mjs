/** @typedef {import("../../../Adapter/Settings/Settings.mjs").Settings} Settings */

export class DeleteCommand {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {DeleteCommand}
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
     * @returns {void}
     */
    delete(key) {
        this.#settings.delete(
            key
        );
    }
}
