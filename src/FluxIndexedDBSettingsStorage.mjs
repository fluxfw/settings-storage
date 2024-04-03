import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

const DATABASE_VERSION_1 = 1;

const DATABASE_VERSION_2 = 2;

const DATABASE_VERSION_CURRENT = DATABASE_VERSION_2;

const INDEX_NAME_MODULE = "module";

const STORE_NAME_SETTINGS = "settings";

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
     * @returns {Promise<SettingsStorage>}
     */
    static async newWithMemoryFallback(database_name) {
        return await this.new(
            database_name
        ) ?? (await import("./FluxMemorySettingsStorage.mjs")).FluxMemorySettingsStorage.new();
    }

    /**
     * @param {string} database_name
     * @returns {Promise<SettingsStorage | null>}
     */
    static async new(database_name) {
        const settings_storage = new this(
            database_name
        );

        if (!await settings_storage.#init()) {
            return null;
        }

        return settings_storage;
    }

    /**
     * @param {string} database_name
     * @private
     */
    constructor(database_name) {
        this.#database_name = database_name;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        if (this.#database === null) {
            return;
        }

        await this.#requestToPromise(
            (await this.#getSettingsStore(
                true
            )).delete([
                module ?? DEFAULT_MODULE,
                key
            ])
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAll() {
        if (this.#database === null) {
            return;
        }

        await this.#requestToPromise(
            (await this.#getSettingsStore(
                true
            )).clear()
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAllByModule(module = null) {
        if (this.#database === null) {
            return;
        }

        const store = await this.#getSettingsStore(
            true
        );

        for (const key of await this.#requestToPromise(
            store.index(INDEX_NAME_MODULE).getAllKeys(module ?? DEFAULT_MODULE)
        )) {
            await this.#requestToPromise(
                store.delete(key)
            );
        }
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        if (this.#database === null) {
            return default_value;
        }

        return (await this.#requestToPromise(
            (await this.#getSettingsStore()).get([
                module ?? DEFAULT_MODULE,
                key
            ])
        ))?.value ?? default_value;
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAll() {
        if (this.#database === null) {
            return [];
        }

        return this.#requestToPromise(
            (await this.#getSettingsStore()).getAll()
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        if (this.#database === null) {
            return [];
        }

        return this.#requestToPromise(
            (await this.#getSettingsStore()).index(INDEX_NAME_MODULE).getAll(module ?? DEFAULT_MODULE)
        );
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        if (this.#database === null) {
            return false;
        }

        return await this.#requestToPromise(
            (await this.#getSettingsStore()).openCursor([
                module ?? DEFAULT_MODULE,
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
        if (this.#database === null) {
            await this.#initDatabase(
                true
            );
        }

        await this.#requestToPromise(
            (await this.#getSettingsStore(
                true
            )).put({
                module: module ?? DEFAULT_MODULE,
                key,
                value
            })
        );
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeMultiple(values) {
        if (this.#database === null) {
            await this.#initDatabase(
                true
            );
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
        let transaction;

        if (this.#upgrade_transaction !== null) {
            transaction = this.#upgrade_transaction;
        } else {
            transaction = this.#database.transaction(name, write ?? false ? "readwrite" : "readonly");

            transaction.addEventListener("abort", e => {
                console.error(e, transaction.error);
            });

            transaction.addEventListener("error", e => {
                console.error(e, transaction.error);
            });
        }

        return transaction.objectStore(name);
    }

    /**
     * @returns {Promise<boolean>}
     */
    async #init() {
        return this.#initDatabase();
    }

    /**
     * @param {boolean | null} store
     * @returns {Promise<boolean>}
     */
    async #initDatabase(store = null) {
        if (this.#database !== null) {
            return true;
        }

        try {
            if ((globalThis.indexedDB?.open ?? null) === null) {
                console.info("indexedDB is not available!");
                return false;
            }

            if (!(store ?? false) && (indexedDB.databases ?? null) !== null && !(await indexedDB.databases()).some(database => database.name === this.#database_name)) {
                return true;
            }

            const request = indexedDB.open(this.#database_name, DATABASE_VERSION_CURRENT);

            request.addEventListener("blocked", e => {
                console.error(e);
            });

            request.addEventListener("upgradeneeded", async e => {
                if (e.newVersion === null) {
                    return;
                }

                this.#database = request.result;

                request.transaction.addEventListener("abort", _e => {
                    console.error(_e, request.transaction.error);
                });

                request.transaction.addEventListener("error", _e => {
                    console.error(_e, request.transaction.error);
                });
                this.#upgrade_transaction = request.transaction;

                let version_1_values = null;
                if (e.oldVersion === DATABASE_VERSION_1) {
                    version_1_values = await this.#version1GetAll();

                    this.#database.deleteObjectStore(STORE_NAME_SETTINGS);
                }

                await this.#createStores();

                if (version_1_values !== null) {
                    await this.storeMultiple(
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
            console.error("Init database failed (", error, ")!");
            return false;
        }

        return true;
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
