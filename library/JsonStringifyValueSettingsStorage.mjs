/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StringifyValueSettingsStorage.mjs").StringifyValueSettingsStorage} StringifyValueSettingsStorage */

export class JsonStringifyValueSettingsStorage {
    /**
     * @param {SettingsStorage} settings_storage
     * @returns {Promise<StringifyValueSettingsStorage>}
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
