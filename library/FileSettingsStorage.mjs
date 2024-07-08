import { dirname } from "node:path";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";

/** @typedef {import("./Settings.mjs").Settings} Settings */
/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

export class FileSettingsStorage {
    /**
     * @type {string}
     */
    #file_path;
    /**
     * @type {(settings: string) => Promise<Settings>}
     */
    #parse;
    /**
     * @type {(settings: Settings) => Promise<string>}
     */
    #stringify;

    /**
     * @param {string} file_path
     * @param {(settings: Settings) => Promise<string>} stringify
     * @param {(settings: string) => Promise<Settings>} parse
     * @returns {Promise<SettingsStorage>}
     */
    static async new(file_path, stringify, parse) {
        const settings_storage = new this(
            file_path,
            stringify,
            parse
        );

        return (await import("./ReadWriteSettingsStorage.mjs")).ReadWriteSettingsStorage.new(
            async () => settings_storage.#read(),
            async settings => {
                await settings_storage.#write(
                    settings
                );
            }
        );
    }

    /**
     * @param {string} file_path
     * @param {(settings: Settings) => Promise<string>} stringify
     * @param {(settings: string) => Promise<Settings>} parse
     * @private
     */
    constructor(file_path, stringify, parse) {
        this.#file_path = file_path;
        this.#stringify = stringify;
        this.#parse = parse;
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
        await mkdir(dirname(this.#file_path), {
            recursive: true
        });

        await writeFile(this.#file_path, await this.#stringify(
            settings
        ));
    }
}
