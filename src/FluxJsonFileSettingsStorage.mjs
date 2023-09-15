import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

/**
 * @implements {FluxJsonFileSettingsStorage}
 */
export class FluxJsonFileSettingsStorage {
    /**
     * @type {string}
     */
    #file_path;
    /**
     * @type {{[key: string]: *}}
     */
    #settings;

    /**
     * @param {string} file_path
     * @returns {Promise<FluxJsonFileSettingsStorage>}
     */
    static async new(file_path) {
        const flux_json_file_settings_storage = new this(
            file_path
        );

        await flux_json_file_settings_storage.#init();

        return flux_json_file_settings_storage;
    }

    /**
     * @param {string} file_path
     * @private
     */
    constructor(file_path) {
        this.#file_path = file_path;
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
        delete this.#settings[module ?? DEFAULT_MODULE]?.[key];

        await this.#write();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        delete this.#settings[module ?? DEFAULT_MODULE];

        await this.#write();
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        this.#settings = {};

        await this.#write();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return structuredClone(this.#settings[module ?? DEFAULT_MODULE]?.[key] ?? default_value);
    }

    /**
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAll(module = null) {
        const _module = module ?? DEFAULT_MODULE;

        return Object.entries(this.#settings[_module] ?? {}).reduce((settings, [
            key,
            value
        ]) => [
                ...settings,
                {
                    module: _module,
                    key,
                    value: structuredClone(value)
                }
            ], []);
    }

    /**
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAllModules() {
        return Object.entries(this.#settings).reduce((settings, [
            module,
            keys
        ]) => Object.entries(keys).reduce((_settings, [
            key,
            value
        ]) => [
                ..._settings,
                {
                    module,
                    key,
                    value: structuredClone(value)
                }
            ], settings), []);
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        const _module = module ?? DEFAULT_MODULE;

        return Object.hasOwn(this.#settings, _module) && Object.hasOwn(this.#settings[_module], key);
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        await this.#store(
            key,
            value,
            module
        );
    }

    /**
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        if (values.length === 0) {
            return;
        }

        for (const value of values) {
            await this.#store(
                value.key,
                value.value,
                value.module ?? null,
                false
            );
        }

        await this.#write();
    }

    /**
     * @returns {Promise<void>}
     */
    async #init() {
        await this.#read();
    }

    /**
     * @returns {Promise<void>}
     */
    async #read() {
        this.#settings = (existsSync(this.#file_path) ? JSON.parse(await readFile(this.#file_path, "utf8")) : null) ?? {};
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @param {boolean | null} write
     * @returns {Promise<void>}
     */
    async #store(key, value, module = null, write = null) {
        const _module = module ?? DEFAULT_MODULE;

        this.#settings[_module] ??= {};

        this.#settings[_module][key] = structuredClone(value);

        if (write ?? true) {
            await this.#write();
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async #write() {
        await writeFile(this.#file_path, JSON.stringify(this.#settings));
    }
}
