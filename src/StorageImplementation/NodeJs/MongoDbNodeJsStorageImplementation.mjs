/** @typedef {import("mongodb").Collection} Collection */
/** @typedef {import("../StorageImplementation.mjs").StorageImplementation} StorageImplementation */

/**
 * @implements {StorageImplementation}
 */
export class MongoDbNodeJsStorageImplementation {
    /**
     * @type {Collection}
     */
    #collection;

    /**
     * @param {Collection} collection
     * @returns {MongoDbNodeJsStorageImplementation}
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
        return Object.fromEntries((await this.#collection.find().toArray()).map(entry => [
            entry.key,
            entry.value
        ]));
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return (await this.#collection.find().toArray()).map(entry => entry.key);
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
        await this.#collection.updateOne({
            key
        }, {
            $set: {
                value
            }
        }, {
            upsert: true
        });
    }
}
