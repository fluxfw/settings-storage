import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

/** @typedef {import("./FluxReadWriteSettingsStorage.mjs").FluxReadWriteSettingsStorage} FluxReadWriteSettingsStorage */
/** @typedef {import("./Settings.mjs").Settings} Settings */

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
     * @returns {Promise<FluxReadWriteSettingsStorage>}
     */
    static async new(file_path, parse, stringify) {
        const flux_file_settings_storage = new this(
            file_path,
            parse,
            stringify
        );

        await flux_file_settings_storage.#init();

        return flux_file_settings_storage.#flux_read_write_settings_storage;
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
