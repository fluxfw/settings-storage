import { Implementation } from "./Implementation.mjs";

export class IndexedDBImplementation extends Implementation {
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
     * @returns {IndexedDBImplementation}
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
        super();

        this.#database_name = database_name;
        this.#store_name = store_name;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        await this.#requestToPromise(
            (await this.#getWritableStore()).clear()
        );
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.#requestToPromise(
            (await this.#getWritableStore()).delete(key)
        );
    }

    /**
     * @param {string} key
     * @returns {Promise<*>}
     */
    async get(key) {
        return this.#requestToPromise(
            (await this.#getReadonlyStore(
                true
            )).get(key)
        );
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        const values = {};

        for await (const cursor of this.#requestToAsyncGenerator(
            (await this.#getReadonlyStore()).openCursor()
        )) {
            values[cursor.key] = cursor.value;
        }

        return values;
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return await this.#requestToPromise(
            (await this.#getReadonlyStore()).openCursor(key)
        ) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await this.#requestToPromise(
            (await this.#getWritableStore()).put(value, key)
        );
    }

    /**
     * @returns {Promise<IDBDatabase>}
     */
    async #getDatabase() {
        if (this.#database === null) {
            const request = indexedDB.open(this.#database_name);

            request.addEventListener("upgradeneeded", () => {
                if (!request.result.objectStoreNames.contains(this.#store_name)) {
                    request.result.createObjectStore(this.#store_name);
                }
            });

            this.#database = await this.#requestToPromise(
                request
            );
        }

        return this.#database;
    }

    /**
     * @returns {Promise<IDBObjectStore>}
     */
    async #getReadonlyStore() {
        return this.#getStore(
            true
        );
    }

    /**
     * @param {boolean} readonly
     * @returns {Promise<IDBObjectStore>}
     */
    async #getStore(readonly) {
        const database = await this.#getDatabase();

        return database.transaction([
            this.#store_name
        ], readonly ? "readonly" : "readwrite").objectStore(this.#store_name);
    }

    /**
     * @returns {Promise<IDBObjectStore>}
     */
    async #getWritableStore() {
        return this.#getStore(
            false
        );
    }

    /**
     * @template C
     * @param {IDBRequest<C & IDBCursor>} request
     * @returns {AsyncGenerator<Exclude<C, null>>}
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
                    cursor: request.result,
                    continue() {
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

            yield result.cursor;

            promise = null;
            result.continue();
        }
    }

    /**
     * @template D
     * @param {IDBRequest<D>} request
     * @returns {Promise<D>}
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
