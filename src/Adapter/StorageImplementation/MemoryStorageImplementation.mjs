import { StorageImplementation } from "./StorageImplementation.mjs";

export class MemoryStorageImplementation extends StorageImplementation {
    /**
     * @type {{[key: string]: *}}
     */
    #settings;

    /**
     * @returns {MemoryStorageImplementation}
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
     * @returns {Promise<*>}
     */
    async get(key) {
        return structuredClone(this.#settings[key]);
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
