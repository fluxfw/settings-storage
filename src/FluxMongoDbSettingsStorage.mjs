import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("mongodb").Collection} Collection */
/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxMongoDbSettingsStorage {
    /**
     * @type {Collection}
     */
    #collection;

    /**
     * @param {Collection} collection
     * @returns {FluxMongoDbSettingsStorage}
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
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return true;
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
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        await this.#collection.deleteMany({
            module: module ?? DEFAULT_MODULE
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        await this.#collection.deleteMany();
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
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAll(module = null) {
        return this.#collection.find({
            module: module ?? DEFAULT_MODULE
        }).map(value => ({
            module: value.module,
            key: value.key,
            value: value.value
        })).toArray();
    }

    /**
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAllModules() {
        return this.#collection.find().map(value => ({
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
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        for (const value of values) {
            await this.store(
                value.key,
                value.value,
                value.module ?? null
            );
        }
    }
}
