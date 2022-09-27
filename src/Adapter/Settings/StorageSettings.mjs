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
     * @returns {void}
     */
    delete(key) {
        this.#storage.removeItem(`${this.#prefix}${key}`);
    }

    /**
     * @param {string} key
     * @returns {string | null}
     */
    get(key) {
        return this.#storage.getItem(`${this.#prefix}${key}`);
    }

    /**
     * @returns {{[key: string]: string}}
     */
    getAll() {
        return Object.fromEntries(Object.entries({
            ...this.#storage
        }).filter(([
            key
        ]) => key.startsWith(this.#prefix)));
    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {void}
     */
    store(key, value) {
        this.#storage.setItem(`${this.#prefix}${key}`, value);
    }
}
