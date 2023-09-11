/** @typedef {import("../FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

const DATABASE_VERSION = 1;

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxIndexedDBBrowserSettingsStorage {
    /**
     * @type {IDBDatabase | null}
     */
    #database = null;
    /**
     * @type {string}
     */
    #database_name;
    /**
     * @type {string}
     */
    #store_name;

    /**
     * @param {string} database_name
     * @param {string} store_name
     * @returns {FluxIndexedDBBrowserSettingsStorage}
     */
    static new(database_name, store_name) {
        return new this(
            database_name,
            store_name
        );
    }

    /**
     * @param {string} database_name
     * @param {string} store_name
     * @private
     */
    constructor(database_name, store_name) {
        this.#database_name = database_name;
        this.#store_name = store_name;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        await this.#requestToPromise(
            (await this.#getStore(
                true
            )).clear()
        );
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.#requestToPromise(
            (await this.#getStore(
                true
            )).delete(key)
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return await this.#requestToPromise(
            (await this.#getStore()).get(key)
        ) ?? default_value;
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        const values = {};

        for await (const cursor of this.#requestToAsyncGenerator(
            (await this.#getStore()).openCursor()
        )) {
            values[cursor.key] = cursor.value;
        }

        return values;
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        const keys = [];

        for await (const cursor of this.#requestToAsyncGenerator(
            (await this.#getStore()).openKeyCursor()
        )) {
            keys.push(cursor.key);
        }

        return keys;
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return await this.#requestToPromise(
            (await this.#getStore()).openCursor(key)
        ) !== null;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.#getDatabase();
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await this.#requestToPromise(
            (await this.#getStore(
                true
            )).put(value, key)
        );
    }

    /**
     * @returns {Promise<IDBDatabase>}
     */
    async #getDatabase() {
        if (this.#database === null) {
            const request = indexedDB.open(this.#database_name, DATABASE_VERSION);

            request.addEventListener("blocked", e => {
                console.error(e);
            });

            request.addEventListener("upgradeneeded", () => {
                if (!request.result.objectStoreNames.contains(this.#store_name)) {
                    request.result.createObjectStore(this.#store_name);
                }
            });

            this.#database = await this.#requestToPromise(
                request
            );

            this.#database.addEventListener("abort", e => {
                console.error(e);
            });

            this.#database.addEventListener("error", e => {
                console.error(e);
            });

            this.#database.addEventListener("versionchange", e => {
                console.error(e);
            });
        }

        return this.#database;
    }

    /**
     * @param {boolean | null} write
     * @returns {Promise<IDBObjectStore>}
     */
    async #getStore(write = null) {
        const database = await this.#getDatabase();

        const transaction = database.transaction([
            this.#store_name
        ], write ?? false ? "readwrite" : "readonly");

        transaction.addEventListener("abort", e => {
            console.error(e, transaction.error);
        });

        transaction.addEventListener("error", e => {
            console.error(e, transaction.error);
        });

        return transaction.objectStore(this.#store_name);
    }

    /**
     * @template R
     * @param {IDBRequest<R>} request
     * @returns {AsyncGenerator<Exclude<R, null>>}
     */
    async* #requestToAsyncGenerator(request) {
        let resolve_promise, reject_promise;

        let promise = new Promise((resolve, reject) => {
            resolve_promise = resolve;
            reject_promise = reject;

            request.addEventListener("error", () => {
                reject_promise(request.error);
            });

            request.addEventListener("success", () => {
                if (request.result === null) {
                    resolve_promise(null);
                    return;
                }

                resolve_promise({
                    result: request.result,
                    continue: () => {
                        promise = new Promise((resolve2, reject2) => {
                            resolve_promise = resolve2;
                            reject_promise = reject2;

                            request.result.continue();
                        });
                    }
                });
            });
        });

        while (promise !== null) {
            const result = await promise;

            if (result === null) {
                break;
            }

            yield result.result;

            promise = null;
            result.continue();
        }
    }

    /**
     * @template R
     * @param {IDBRequest<R>} request
     * @returns {Promise<R>}
     */
    async #requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.addEventListener("error", () => {
                reject(request.error);
            });

            request.addEventListener("success", () => {
                resolve(request.result);
            });
        });
    }
}
