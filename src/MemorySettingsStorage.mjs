/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

export class MemorySettingsStorage {
    /**
     * @returns {Promise<SettingsStorage>}
     */
    static async new() {
        return (await import("./ReadWriteSettingsStorage.mjs")).ReadWriteSettingsStorage.new(
            async () => ({}),
            async () => { }
        );
    }

    /**
     * @private
     */
    constructor() {

    }
}
