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
     * @returns {Promise<void>}
     */
    async reset() {
        for (const key of Object.keys(await this.#settings.getAll())) {
            await this.#settings.delete(
                key
            );
        }
    }
}
