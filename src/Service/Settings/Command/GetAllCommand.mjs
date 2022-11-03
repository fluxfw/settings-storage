/** @typedef {import("../../../Adapter/Settings/Settings.mjs").Settings} Settings */

export class GetAllCommand {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {GetAllCommand}
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
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return Object.fromEntries(Object.entries(await this.#settings.getAll()).map(([
            key,
            value
        ]) => [
                key,
                JSON.parse(value)
            ]));
    }
}
