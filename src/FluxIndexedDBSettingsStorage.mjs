/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

const DATABASE_VERSION = 2;

const INDEX_NAME_MODULE = "module";

const STORE_NAME_SETTINGS = "settings";

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxIndexedDBSettingsStorage {
    /**
     * @type {IDBDatabase | null}
     */
    #database = null;
    /**
     * @type {string}
     */
    #database_name;
    /**
     * @type {IDBTransaction | null}
     */
    #upgrade_transaction = null;

    /**
     * @param {string} database_name
     * @returns {Promise<FluxIndexedDBSettingsStorage>}
     */
    static async new(database_name) {
        const flux_indexed_db_browser_settings_storage = new this(
            database_name
        );

        await flux_indexed_db_browser_settings_storage.#init();

        return flux_indexed_db_browser_settings_storage;
    }

    /**
     * @param {string} database_name
     * @private
     */
    constructor(database_name) {
        this.#database_name = database_name;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return this.#canStore();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        if (!this.#canStore()) {
            return;
        }

        await this.#requestToPromise(
            (await this.#getSettingsStore(
                true
            )).delete([
                module ?? "",
                key
            ])
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        if (!this.#canStore()) {
            return;
        }

        const store = await this.#getSettingsStore(
            true
        );

        for (const key of await this.#requestToPromise(
            store.index(INDEX_NAME_MODULE).getAllKeys(module ?? "")
        )) {
            await this.#requestToPromise(
                store.delete(key)
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        if (!this.#canStore()) {
            return;
        }

        await this.#requestToPromise(
            (await this.#getSettingsStore(
                true
            )).clear()
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        if (!this.#canStore()) {
            return default_value;
        }

        return (await this.#requestToPromise(
            (await this.#getSettingsStore()).get([
                module ?? "",
                key
            ])
        ))?.value ?? default_value;
    }

    /**
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAll(module = null) {
        if (!this.#canStore()) {
            return [];
        }

        return this.#requestToPromise(
            (await this.#getSettingsStore()).index(INDEX_NAME_MODULE).getAll(module ?? "")
        );
    }

    /**
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAllModules() {
        if (!this.#canStore()) {
            return [];
        }

        return this.#requestToPromise(
            (await this.#getSettingsStore()).getAll()
        );
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        if (!this.#canStore()) {
            return false;
        }

        return await this.#requestToPromise(
            (await this.#getSettingsStore()).openCursor([
                module ?? "",
                key
            ])
        ) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        if (!this.#canStore()) {
            return;
        }

        await this.#requestToPromise(
            (await this.#getSettingsStore(
                true
            )).put({
                module: module ?? "",
                key,
                value
            })
        );
    }

    /**
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        if (!this.#canStore()) {
            return;
        }

        for (const value of values) {
            await this.store(
                value.key,
                value.value,
                value.module ?? null
            );
        }
    }

    /**
     * @returns {boolean}
     */
    #canStore() {
        return this.#database !== null;
    }

    /**
     * @returns {Promise<void>}
     */
    async #createSettingsStore() {
        let store;

        if (!this.#database.objectStoreNames.contains(STORE_NAME_SETTINGS)) {
            store = this.#database.createObjectStore(STORE_NAME_SETTINGS, {
                keyPath: [
                    "module",
                    "key"
                ]
            });
        } else {
            store = await this.#getSettingsStore();
        }

        if (!store.indexNames.contains(INDEX_NAME_MODULE)) {
            store.createIndex(INDEX_NAME_MODULE, "module");
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #createStores() {
        await this.#createSettingsStore();
    }

    /**
     * @param {boolean | null} write
     * @returns {Promise<IDBObjectStore>}
     */
    async #getSettingsStore(write = null) {
        return this.#getStore(
            STORE_NAME_SETTINGS,
            write
        );
    }

    /**
     * @param {string} name
     * @param {boolean | null} write
     * @returns {Promise<IDBObjectStore>}
     */
    async #getStore(name, write = null) {
        const transaction = this.#upgrade_transaction ?? this.#database.transaction(name, write ?? false ? "readwrite" : "readonly");

        transaction.addEventListener("abort", e => {
            console.error(e, transaction.error);
        });

        transaction.addEventListener("error", e => {
            console.error(e, transaction.error);
        });

        return transaction.objectStore(name);
    }

    /**
     * @returns {Promise<void>}
     */
    async #init() {
        await this.#initDatabase();
    }

    /**
     * @returns {Promise<void>}
     */
    async #initDatabase() {
        try {
            if ((globalThis.indexedDB?.open ?? null) === null) {
                return;
            }

            const request = indexedDB.open(this.#database_name, DATABASE_VERSION);

            request.addEventListener("blocked", e => {
                console.error(e);
            });

            request.addEventListener("upgradeneeded", async e => {
                if (e.newVersion === null) {
                    return;
                }

                this.#database = request.result;
                this.#upgrade_transaction = request.transaction;

                let version_1_values = null;
                if (e.oldVersion === 1) {
                    version_1_values = await this.#version1GetAll();

                    this.#database.deleteObjectStore(STORE_NAME_SETTINGS);
                }

                await this.#createStores();

                if (version_1_values !== null) {
                    await this.storeAll(
                        Object.entries(version_1_values).map(([
                            key,
                            value
                        ]) => ({
                            key,
                            value
                        }))
                    );
                }

                this.#upgrade_transaction = null;
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
        } catch (error) {
            console.error("Init database failed (", error, ")");
        }
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

    /**
     * @returns {Promise<{[key: string]: *}>}
     * @deprecated
     */
    async #version1GetAll() {
        const values = {};

        for await (const cursor of this.#requestToAsyncGenerator(
            (await this.#getSettingsStore()).openCursor()
        )) {
            values[cursor.key] = cursor.value;
        }

        return values;
    }
}
