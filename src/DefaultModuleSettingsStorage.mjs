import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class DefaultModuleSettingsStorage {
    /**
     * @type {string}
     */
    #default_module;
    /**
     * @type {SettingsStorage}
     */
    #settings_storage;

    /**
     * @param {SettingsStorage} settings_storage
     * @param {string | null} default_module
     * @returns {Promise<SettingsStorage>}
     */
    static async new(settings_storage, default_module = null) {
        return new this(
            settings_storage,
            default_module ?? DEFAULT_MODULE
        );
    }

    /**
     * @param {SettingsStorage} settings_storage
     * @param {string} default_module
     * @private
     */
    constructor(settings_storage, default_module) {
        this.#settings_storage = settings_storage;
        this.#default_module = default_module;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#settings_storage.delete(
            key,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAll() {
        await this.#settings_storage.deleteAll();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAllByModule(module = null) {
        await this.#settings_storage.deleteAllByModule(
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return this.#settings_storage.get(
            key,
            default_value,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAll() {
        return this.#settings_storage.getAll();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        return this.#settings_storage.getAllByModule(
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#settings_storage.has(
            key,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        await this.#settings_storage.store(
            key,
            value,
            this.#getModule(
                module
            )
        );
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeMultiple(values) {
        await this.#settings_storage.storeMultiple(
            values
        );
    }

    /**
     * @param {string| null} module
     * @returns {string}
     */
    #getModule(module) {
        return module ?? this.#default_module;
    }
}
