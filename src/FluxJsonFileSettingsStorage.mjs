/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

export class FluxJsonFileSettingsStorage {
    /**
     * @param {string} file_path
     * @returns {Promise<SettingsStorage>}
     */
    static async new(file_path) {
        return (await import("./FluxFileSettingsStorage.mjs")).FluxFileSettingsStorage.new(
            file_path,
            async settings => JSON.stringify(settings),
            async settings => JSON.parse(settings)
        );
    }

    /**
     * @private
     */
    constructor() {

    }
}
