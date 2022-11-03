import { Settings } from "./Settings.mjs";

export class StorageSettings extends Settings {
    /**
     * @type {string}
     */
    #prefix;
    /**
     * @type {Storage}
     */
    #storage;

    /**
     * @param {string} prefix
     * @param {Storage | null} storage
     * @returns {StorageSettings}
     */
    static new(prefix = "", storage = null) {
        return new this(
            prefix,
            storage ?? localStorage
        );
    }

    /**
     * @param {string} prefix
     * @param {Storage} storage
     * @private
     */
    constructor(prefix, storage) {
        super();

        this.#prefix = prefix;
        this.#storage = storage;
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        this.#storage.removeItem(`${this.#prefix}${key}`);
    }

    /**
     * @param {string} key
     * @returns {Promise<string | null>}
     */
    async get(key) {
        return this.#storage.getItem(`${this.#prefix}${key}`);
    }

    /**
     * @returns {Promise<{[key: string]: string}>}
     */
    async getAll() {
        return Object.fromEntries(Object.entries({
            ...this.#storage
        }).filter(([
            key
        ]) => key.startsWith(this.#prefix)));
    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        this.#storage.setItem(`${this.#prefix}${key}`, value);
    }
}
