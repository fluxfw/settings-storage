/** @typedef {import("mongodb").Collection} Collection */
/** @typedef {import("../FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxMongoDbNodeJsSettingsStorage {
    /**
     * @type {Collection}
     */
    #collection;

    /**
     * @param {Collection} collection
     * @returns {FluxMongoDbNodeJsSettingsStorage}
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
     * @returns {Promise<void>}
     */
    async clear() {
        await this.#collection.deleteMany();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.#collection.deleteMany({
            key
        });
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return (await this.#collection.findOne({
            key
        }))?.value ?? default_value;
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return Object.fromEntries(await this.#collection.find().map(entry => [
            entry.key,
            entry.value
        ]).toArray());
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return this.#collection.find().map(entry => entry.key).toArray();
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return await this.#collection.findOne({
            key
        }) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await this.#collection.replaceOne({
            key
        }, {
            key,
            value
        }, {
            upsert: true
        });
    }
}
