/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

export class FluxJsonStringifyValueSettingsStorage {
    /**
     * @param {SettingsStorage} settings_storage
     * @returns {Promise<SettingsStorage>}
     */
    static async new(settings_storage) {
        return (await import("./FluxStringifyValueSettingsStorage.mjs")).FluxStringifyValueSettingsStorage.new(
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
