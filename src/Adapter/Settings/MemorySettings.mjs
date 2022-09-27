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
     * @returns {void}
     */
    delete(key) {
        delete this.#settings[key];
    }

    /**
     * @param {string} key
     * @returns {string | null}
     */
    get(key) {
        return this.#settings[key] ?? null;
    }

    /**
     * @returns {{[key: string]: string}}
     */
    getAll() {
        return {
            ...this.#settings
        };
    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {void}
     */
    store(key, value) {
        this.#settings[key] = value;
    }
}
