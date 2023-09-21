/** @typedef {import("./FluxFileSettingsStorage.mjs").FluxFileSettingsStorage} FluxFileSettingsStorage */

export class FluxJsonFileSettingsStorage {
    /**
     * @param {string} file_path
     * @returns {Promise<FluxFileSettingsStorage>}
     */
    static async new(file_path) {
        return (await import("./FluxFileSettingsStorage.mjs")).FluxFileSettingsStorage.new(
            file_path,
            async string => JSON.parse(string),
            async settings => JSON.stringify(settings)
        );
    }

    /**
     * @private
     */
    constructor() {

    }
}
