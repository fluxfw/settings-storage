/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxMemorySettingsStorage {
    /**
     * @type {{[key: string]: {[key: string]: *}}}
     */
    #settings;

    /**
     * @returns {FluxMemorySettingsStorage}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {
        this.#settings = {};
    }

    /**
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return true;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        delete this.#settings[module ?? ""]?.[key];
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        delete this.#settings[module ?? ""];
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        this.#settings = {};
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return structuredClone(this.#settings[module ?? ""]?.[key] ?? default_value);
    }

    /**
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAll(module = null) {
        const _module = module ?? "";

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
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAllModules() {
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
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        const _module = module ?? "";

        return Object.hasOwn(this.#settings, _module) && Object.hasOwn(this.#settings[_module], key);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        const _module = module ?? "";

        this.#settings[_module] ??= {};

        this.#settings[_module][key] = structuredClone(value);
    }

    /**
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        for (const value of values) {
            await this.store(
                value.key,
                value.value,
                value.module ?? null
            );
        }
    }
}
