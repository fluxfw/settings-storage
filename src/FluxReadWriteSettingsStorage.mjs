import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./Settings.mjs").Settings} Settings */
/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class FluxReadWriteSettingsStorage {
    /**
     * @type {Settings}
     */
    #settings;
    /**
     * @type {() => Promise<Settings>}
     */
    #_read;
    /**
     * @type {(settings: Settings) => Promise<void>}
     */
    #_write;

    /**
     * @param {() => Promise<Settings>} read
     * @param {(settings: Settings) => Promise<void>} write
     * @returns {Promise<SettingsStorage>}
     */
    static async new(read, write) {
        const flux_read_write_settings_storage = new this(
            read,
            write
        );

        await flux_read_write_settings_storage.#init();

        return flux_read_write_settings_storage;
    }

    /**
     * @param {() => Promise<Settings>} read
     * @param {(settings: Settings) => Promise<void>} write
     * @private
     */
    constructor(read, write) {
        this.#_read = read;
        this.#_write = write;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        delete this.#settings[module ?? DEFAULT_MODULE]?.[key];

        await this.#write();
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAll() {
        this.#settings = {};

        await this.#write();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAllByModule(module = null) {
        delete this.#settings[module ?? DEFAULT_MODULE];

        await this.#write();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return structuredClone(this.#settings[module ?? DEFAULT_MODULE]?.[key] ?? default_value);
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAll() {
        return Object.entries(this.#settings).reduce((settings, [
            module,
            keys
        ]) => Object.entries(keys).reduce((_settings, [
            key,
            value
        ]) => [
                ..._settings,
                {
                    module,
                    key,
                    value: structuredClone(value)
                }
            ], settings), []);
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        const _module = module ?? DEFAULT_MODULE;

        return Object.entries(this.#settings[_module] ?? {}).reduce((settings, [
            key,
            value
        ]) => [
                ...settings,
                {
                    module: _module,
                    key,
                    value: structuredClone(value)
                }
            ], []);
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        const _module = module ?? DEFAULT_MODULE;

        return Object.hasOwn(this.#settings, _module) && Object.hasOwn(this.#settings[_module], key);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        await this.#store(
            key,
            value,
            module
        );
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeMultiple(values) {
        if (values.length === 0) {
            return;
        }

        for (const value of values) {
            await this.#store(
                value.key,
                value.value,
                value.module ?? null,
                false
            );
        }

        await this.#write();
    }

    /**
     * @returns {Promise<void>}
     */
    async #init() {
        await this.#read();
    }

    /**
     * @returns {Promise<void>}
     */
    async #read() {
        this.#settings = structuredClone(await this.#_read());
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @param {boolean | null} write
     * @returns {Promise<void>}
     */
    async #store(key, value, module = null, write = null) {
        const _module = module ?? DEFAULT_MODULE;

        this.#settings[_module] ??= {};

        this.#settings[_module][key] = structuredClone(value);

        if (write ?? true) {
            await this.#write();
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #write() {
        await this.#_write(
            structuredClone(this.#settings)
        );
    }
}
