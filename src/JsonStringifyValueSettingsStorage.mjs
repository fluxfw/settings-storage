/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

export class JsonStringifyValueSettingsStorage {
    /**
     * @param {SettingsStorage} settings_storage
     * @returns {Promise<SettingsStorage>}
     */
    static async new(settings_storage) {
        return (await import("./StringifyValueSettingsStorage.mjs")).StringifyValueSettingsStorage.new(
            settings_storage,
            async value => JSON.stringify(value),
            async value => JSON.parse(value)
        );
    }

    /**
     * @private
     */
    constructor() {

    }
}
