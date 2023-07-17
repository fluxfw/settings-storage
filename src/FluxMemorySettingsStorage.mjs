/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxMemorySettingsStorage {
    /**
     * @type {{[key: string]: *}}
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
     * @returns {Promise<void>}
     */
    async clear() {
        this.#settings = {};
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        delete this.#settings[key];
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return structuredClone(this.#settings[key] ?? default_value);
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return structuredClone(this.#settings);
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return Object.keys(this.#settings);
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return Object.hasOwn(this.#settings, key);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        this.#settings[key] = structuredClone(value);
    }
}
