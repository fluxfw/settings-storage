/** @typedef {import("./FluxReadWriteSettingsStorage.mjs").FluxReadWriteSettingsStorage} FluxReadWriteSettingsStorage */

export class FluxMemorySettingsStorage {
    /**
     * @returns {Promise<FluxReadWriteSettingsStorage>}
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
