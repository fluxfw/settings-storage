import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("mongodb").Collection} Collection */
/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class FluxMongoDbSettingsStorage {
    /**
     * @type {Collection}
     */
    #collection;

    /**
     * @param {Collection} collection
     * @returns {SettingsStorage}
     */
    static new(collection) {
        return new this(
            collection
        );
    }

    /**
     * @param {Collection} collection
     * @private
     */
    constructor(collection) {
        this.#collection = collection;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#collection.deleteMany({
            module: module ?? DEFAULT_MODULE,
            key
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAll() {
        await this.#collection.deleteMany();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAllByModule(module = null) {
        await this.#collection.deleteMany({
            module: module ?? DEFAULT_MODULE
        });
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return (await this.#collection.findOne({
            module: module ?? DEFAULT_MODULE,
            key
        }))?.value ?? default_value;
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAll() {
        return this.#collection.find().map(value => ({
            module: value.module,
            key: value.key,
            value: value.value
        })).toArray();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        return this.#collection.find({
            module: module ?? DEFAULT_MODULE
        }).map(value => ({
            module: value.module,
            key: value.key,
            value: value.value
        })).toArray();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return await this.#collection.findOne({
            module: module ?? DEFAULT_MODULE,
            key
        }) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        const _module = module ?? DEFAULT_MODULE;

        await this.#collection.replaceOne({
            module: _module,
            key
        }, {
            module: _module,
            key,
            value
        }, {
            upsert: true
        });
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeMultiple(values) {
        for (const value of values) {
            await this.store(
                value.key,
                value.value,
                value.module ?? null
            );
        }
    }
}
