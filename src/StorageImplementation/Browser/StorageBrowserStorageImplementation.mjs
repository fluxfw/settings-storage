/** @typedef {import("../StorageImplementation.mjs").StorageImplementation} StorageImplementation */

/**
 * @implements {StorageImplementation}
 */
export class StorageBrowserStorageImplementation {
    /**
     * @type {string}
     */
    #key_prefix;
    /**
     * @type {Storage}
     */
    #storage;

    /**
     * @param {string} key_prefix
     * @param {Storage} storage
     * @returns {StorageBrowserStorageImplementation}
     */
    static new(key_prefix, storage) {
        return new this(
            key_prefix,
            storage
        );
    }

    /**
     * @param {string} key_prefix
     * @param {Storage} storage
     * @private
     */
    constructor(key_prefix, storage) {
        this.#key_prefix = key_prefix;
        this.#storage = storage;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        await Promise.all(this.#getAll().map(async ([
            key
        ]) => this.delete(
            key
        )));
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        this.#storage.removeItem(this.#getKey(
            key
        ));
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        const value = this.#storage.getItem(this.#getKey(
            key
        ));

        if (value === null) {
            return default_value;
        }

        return JSON.parse(value) ?? default_value;
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return Object.fromEntries(this.#getAll().map(([
            key,
            value
        ]) => [
                key,
                JSON.parse(value)
            ]));
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return Object.keys(this.#getAll());
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return this.#storage.getItem(this.#getKey(
            key
        )) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        this.#storage.setItem(this.#getKey(
            key
        ), JSON.stringify(value));
    }

    /**
     * @returns {[string, *]}
     */
    #getAll() {
        return Object.entries({
            ...this.#storage
        }).filter(([
            key
        ]) => key.startsWith(this.#key_prefix));
    }

    /**
     * @param {string} key
     * @returns {string}
     */
    #getKey(key) {
        return `${this.#key_prefix}${key}`;
    }
}
