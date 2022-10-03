/** @typedef {import("../../../Adapter/Settings/Settings.mjs").Settings} Settings */

export class ResetCommand {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {ResetCommand}
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
     * @returns {void}
     */
    reset() {
        for (const key of Object.keys(this.#settings.getAll())) {
            this.#settings.delete(
                key
            );
        }
    }
}
