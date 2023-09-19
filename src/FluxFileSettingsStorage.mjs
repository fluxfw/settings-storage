import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("./FluxReadWriteSettingsStorage.mjs").FluxReadWriteSettingsStorage} FluxReadWriteSettingsStorage */
/** @typedef {import("./Settings.mjs").Settings} Settings */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class FluxFileSettingsStorage {
    /**
     * @type {string}
     */
    #file_path;
    /**
     * @type {FluxReadWriteSettingsStorage}
     */
    #flux_read_write_settings_storage;
    /**
     * @type {(string: string) => Promise<Settings>}
     */
    #parse;
    /**
     * @type {(settings: Settings) => Promise<string>}
     */
    #stringify;

    /**
     * @param {string} file_path
     * @param {(string: string) => Promise<Settings>} parse
     * @param {(settings: Settings) => Promise<string>} stringify
     * @returns {Promise<FluxFileSettingsStorage>}
     */
    static async new(file_path, parse, stringify) {
        const flux_file_settings_storage = new this(
            file_path,
            parse,
            stringify
        );

        await flux_file_settings_storage.#init();

        return flux_file_settings_storage;
    }

    /**
     * @param {string} file_path
     * @param {(string: string) => Promise<Settings>} parse
     * @param {(settings: Settings) => Promise<string>} stringify
     * @private
     */
    constructor(file_path, parse, stringify) {
        this.#file_path = file_path;
        this.#parse = parse;
        this.#stringify = stringify;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return this.#flux_read_write_settings_storage.canStore();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#flux_read_write_settings_storage.delete(
            key,
            module
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        await this.#flux_read_write_settings_storage.deleteAll(
            module
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        await this.#flux_read_write_settings_storage.deleteAllModules();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return this.#flux_read_write_settings_storage.get(
            key,
            default_value,
            module
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAll(module = null) {
        return this.#flux_read_write_settings_storage.getAll(
            module
        );
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAllModules() {
        return this.#flux_read_write_settings_storage.getAllModules();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#flux_read_write_settings_storage.has(
            key,
            module
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        await this.#flux_read_write_settings_storage.store(
            key,
            value,
            module
        );
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        await this.#flux_read_write_settings_storage.storeAll(
            values
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #init() {
        this.#flux_read_write_settings_storage = await (await import("./FluxReadWriteSettingsStorage.mjs")).FluxReadWriteSettingsStorage.new(
            async () => this.#read(),
            async settings => {
                await this.#write(
                    settings
                );
            }
        );
    }

    /**
     * @returns {Promise<Settings>}
     */
    async #read() {
        return existsSync(this.#file_path) ? this.#parse(
            await readFile(this.#file_path, "utf8")
        ) : {};
    }

    /**
     * @param {Settings} settings
     * @returns {Promise<void>}
     */
    async #write(settings) {
        await writeFile(this.#file_path, await this.#stringify(
            settings
        ));
    }
}
