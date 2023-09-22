/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

export class FluxMemorySettingsStorage {
    /**
     * @returns {Promise<SettingsStorage>}
     */
    static async new() {
        return (await import("./FluxReadWriteSettingsStorage.mjs")).FluxReadWriteSettingsStorage.new(
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
