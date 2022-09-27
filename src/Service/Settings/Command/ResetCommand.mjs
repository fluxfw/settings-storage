import { Settings } from "../../../Adapter/Settings/Settings.mjs";

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
