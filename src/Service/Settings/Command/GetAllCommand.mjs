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
     * @returns {{[key: string]: *}}
     */
    getAll() {
        return Object.fromEntries(Object.entries(this.#settings.getAll()).map(([
            key,
            value
        ]) => [
                key,
                JSON.parse(value)
            ]));
    }
}
