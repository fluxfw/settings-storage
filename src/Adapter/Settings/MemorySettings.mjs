import { Settings } from "./Settings.mjs";

export class MemorySettings extends Settings {
    /**
     * @type {{[key: string]: string}}
     */
    #settings;

    /**
     * @returns {MemorySettings}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {
        super();

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
     * @returns {Promise<string | null>}
     */
    async get(key) {
        return this.#settings[key] ?? null;
    }

    /**
     * @returns {Promise<{[key: string]: string}>}
     */
    async getAll() {
        return {
            ...this.#settings
        };
    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        this.#settings[key] = value;
    }
}
