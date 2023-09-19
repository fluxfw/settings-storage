/** @typedef {import("./FluxReadWriteSettingsStorage.mjs").FluxReadWriteSettingsStorage} FluxReadWriteSettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class FluxMemorySettingsStorage {
    /**
     * @type {FluxReadWriteSettingsStorage}
     */
    #flux_read_write_settings_storage;

    /**
     * @returns {Promise<FluxMemorySettingsStorage>}
     */
    static async new() {
        return new this(
            await (await import("./FluxReadWriteSettingsStorage.mjs")).FluxReadWriteSettingsStorage.new(
                async () => ({}),
                async () => { }
            )
        );
    }

    /**
     * @param {FluxReadWriteSettingsStorage} flux_read_write_settings_storage
     * @private
     */
    constructor(flux_read_write_settings_storage) {
        this.#flux_read_write_settings_storage = flux_read_write_settings_storage;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return this.#flux_read_write_settings_storage.canStore();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#flux_read_write_settings_storage.delete(
            key,
            module
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        await this.#flux_read_write_settings_storage.deleteAll(
            module
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        await this.#flux_read_write_settings_storage.deleteAllModules();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return this.#flux_read_write_settings_storage.get(
            key,
            default_value,
            module
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAll(module = null) {
        return this.#flux_read_write_settings_storage.getAll(
            module
        );
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAllModules() {
        return this.#flux_read_write_settings_storage.getAllModules();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#flux_read_write_settings_storage.has(
            key,
            module
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        await this.#flux_read_write_settings_storage.store(
            key,
            value,
            module
        );
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        await this.#flux_read_write_settings_storage.storeAll(
            values
        );
    }
}
