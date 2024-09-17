/** @typedef {import("./ReadWriteSettingsStorage.mjs").ReadWriteSettingsStorage} ReadWriteSettingsStorage */

export class JsonFileSettingsStorage {
    /**
     * @param {string} file_path
     * @returns {Promise<ReadWriteSettingsStorage>}
     */
    static async new(file_path) {
        return (await import("./FileSettingsStorage.mjs")).FileSettingsStorage.new(
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
