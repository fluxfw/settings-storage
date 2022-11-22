import { Implementation } from "./Implementation.mjs";

export class MemoryImplementation extends Implementation {
    /**
     * @type {{[key: string]: *}}
     */
    #settings;

    /**
     * @returns {MemoryImplementation}
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
        return this.#settings[key];
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return {
            ...this.#settings
        };
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
        this.#settings[key] = value;
    }
}
