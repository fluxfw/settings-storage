import { Implementation } from "./Implementation.mjs";

export class StorageImplementation extends Implementation {
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
     * @returns {Promise<Implementation>}
     */
    static async newWithMemoryFallback(prefix = "") {
        let implementation;

        try {
            implementation = this.new(
                prefix
            );
        } catch (error) {
            console.info("Unvailable StorageImplementation - Using MemoryImplementation fallback (", error, ")");

            implementation = (await import("./MemoryImplementation.mjs")).MemoryImplementation.new();
        }

        return implementation;
    }

    /**
     * @param {string} prefix
     * @param {Storage | null} storage
     * @returns {StorageImplementation}
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
        this.#storage.removeItem(`${this.#prefix}${key}`);
    }

    /**
     * @param {string} key
     * @returns {Promise<*>}
     */
    async get(key) {
        const value = this.#storage.getItem(`${this.#prefix}${key}`);

        if (value === null) {
            return null;
        }

        return JSON.parse(value);
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
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return this.#storage.getItem(`${this.#prefix}${key}`) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        this.#storage.setItem(`${this.#prefix}${key}`, JSON.stringify(value));
    }

    /**
     * @returns {[string, *]}
     */
    #getAll() {
        return Object.entries({
            ...this.#storage
        }).filter(([
            key
        ]) => key.startsWith(this.#prefix));
    }
}
