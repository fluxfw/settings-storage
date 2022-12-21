import { StorageImplementation } from "../StorageImplementation.mjs";

/** @typedef {import("mongodb").Collection} Collection */

export class MongoDbNodeJsStorageImplementation extends StorageImplementation {
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
        super();

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
     * @returns {Promise<*>}
     */
    async get(key) {
        return (await this.#collection.findOne({
            key
        }))?.value;
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
