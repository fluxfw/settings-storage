import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("../StorageImplementation.mjs").StorageImplementation} StorageImplementation */

/**
 * @implements {StorageImplementation}
 */
export class JsonFileNodeJsStorageImplementation {
    /**
     * @type {string}
     */
    #file_path;
    /**
     * @type {{[key: string]: *}}
     */
    #settings = null;

    /**
     * @param {string} file_path
     * @returns {JsonFileNodeJsStorageImplementation}
     */
    static new(file_path) {
        return new this(
            file_path
        );
    }

    /**
     * @param {string} file_path
     * @private
     */
    constructor(file_path) {
        this.#file_path = file_path;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        this.#settings = {};

        await this.#write();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await this.#read();

        delete this.#settings[key];

        await this.#write();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        await this.#read();

        return structuredClone(this.#settings[key]) ?? default_value;
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        await this.#read();

        return structuredClone(this.#settings);
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        await this.#read();

        return Object.keys(this.#settings);
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        await this.#read();

        return Object.hasOwn(this.#settings, key);
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.#read();
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await this.#read();

        this.#settings[key] = structuredClone(value);

        await this.#write();
    }

    /**
     * @returns {Promise<void>}
     */
    async #read() {
        this.#settings ??= (existsSync(this.#file_path) ? JSON.parse(await readFile(this.#file_path, "utf8")) : null) ?? {};
    }

    /**
     * @returns {Promise<void>}
     */
    async #write() {
        await writeFile(this.#file_path, JSON.stringify(this.#settings));
    }
}
