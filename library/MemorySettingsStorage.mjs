/** @typedef {import("./ReadWriteSettingsStorage.mjs").ReadWriteSettingsStorage} ReadWriteSettingsStorage */

export class MemorySettingsStorage {
    /**
     * @returns {Promise<ReadWriteSettingsStorage>}
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
