import { existsSync } from "node:fs";
import { StorageImplementation } from "../StorageImplementation.mjs";
import { readFile, writeFile } from "node:fs/promises";

export class JsonFileNodeJsStorageImplementation extends StorageImplementation {
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
        super();

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
     * @returns {Promise<*>}
     */
    async get(key) {
        await this.#read();

        return structuredClone(this.#settings[key]);
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        await this.#read();

        return structuredClone(this.#settings);
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
        this.#settings ??= (existsSync(this.#file_path) ? JSON.parse((await readFile(this.#file_path, "utf8")).trim().replaceAll("\r\n", "\n").replaceAll("\r", "\n")) : null) ?? {};
    }

    /**
     * @returns {Promise<void>}
     */
    async #write() {
        await writeFile(this.#file_path, JSON.stringify(this.#settings), "utf8");
    }
}
