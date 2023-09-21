import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./FluxFileSettingsStorage.mjs").FluxFileSettingsStorage} FluxFileSettingsStorage */
/** @typedef {import("./Settings.mjs").Settings} Settings */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

const COMMENT_1 = ";";

const COMMENT_2 = "#";

const ESCAPE_CHAR = "\\";

const FIELD_SEPARATOR = "=";

const LINE_SEPARATOR = "\n";

const SECTION_START = "[";

const SECTION_END = "]";

const ESCAPE_CHARS = Object.freeze([
    ESCAPE_CHAR,
    LINE_SEPARATOR,
    SECTION_START,
    SECTION_END,
    FIELD_SEPARATOR,
    COMMENT_1,
    COMMENT_2,
    "\"",
    "'",
    ".",
    ":"
]);

export class FluxIniFileSettingsStorage {
    /**
     * @type {FluxFileSettingsStorage}
     */
    #flux_file_settings_storage;

    /**
     * @param {string} file_path
     * @returns {Promise<FluxIniFileSettingsStorage>}
     */
    static async new(file_path) {
        const flux_ini_file_settings_storage = new this();

        await flux_ini_file_settings_storage.#init(
            file_path
        );

        return flux_ini_file_settings_storage;
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#flux_file_settings_storage.delete(
            key,
            module
        );
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        await this.#flux_file_settings_storage.deleteAll(
            module
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        await this.#flux_file_settings_storage.deleteAllModules();
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        let value = await this.#flux_file_settings_storage.get(
            key,
            default_value,
            module
        );

        if (typeof default_value === "number" && typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value) && !isNaN(value)) {
            const _value = parseFloat(value);
            if (!Number.isNaN(_value)) {
                value = _value;
            }
        }

        if (typeof default_value === "boolean") {
            if (value === "true" || value === 1 || value === "1") {
                value = true;
            } else {
                if (value === "false" || value === 0 || value === "0") {
                    value = false;
                }
            }
        }

        return value;
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAll(module = null) {
        return this.#flux_file_settings_storage.getAll(
            module
        );
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAllModules() {
        return this.#flux_file_settings_storage.getAllModules();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#flux_file_settings_storage.has(
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
        await this.#flux_file_settings_storage.store(
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
        await this.#flux_file_settings_storage.storeAll(
            values
        );
    }

    /**
     * @param {*} value
     * @returns {string}
     */
    #escape(value) {
        return ESCAPE_CHARS.reduce((_value, char) => _value.replaceAll(char, `${ESCAPE_CHAR}${char}`), `${value}`);
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    #escapeRegExp(value) {
        return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /**
     * @param {string} file_path
     * @returns {Promise<void>}
     */
    async #init(file_path) {
        this.#flux_file_settings_storage = await (await import("./FluxFileSettingsStorage.mjs")).FluxFileSettingsStorage.new(
            file_path,
            async string => this.#parse(
                string
            ),
            async settings => this.#stringify(
                settings
            )
        );
    }

    /**
     * @param {string} value
     * @returns {boolean}
     */
    #isEndEscaped(value) {
        return value.match(new RegExp(`${this.#escapeRegExp(
            ESCAPE_CHAR
        )}*$`))[0].length % 2 === 1;
    }

    /**
     * @param {string} string
     * @returns {Promise<Settings>}
     */
    async #parse(string) {
        const settings = {};

        let current_module = DEFAULT_MODULE;
        let current_multiline_key = null;

        for (const line of string.replaceAll(`\r${LINE_SEPARATOR}`, LINE_SEPARATOR).replaceAll("\r", LINE_SEPARATOR).split(LINE_SEPARATOR)) {
            const _line = this.#removeComments(
                line
            );

            if (current_multiline_key !== null) {
                const key = current_multiline_key;

                let value = `${settings[current_module][key]}${_line}`;

                if (this.#isEndEscaped(
                    _line
                )) {
                    value += LINE_SEPARATOR;
                } else {
                    value = this.#unescape(
                        value
                    );

                    current_multiline_key = null;
                }

                settings[current_module][key] = value;
                continue;
            }

            if (_line.trim() === "") {
                continue;
            }

            if (_line.startsWith(SECTION_START) && _line.endsWith(SECTION_END)) {
                current_module = this.#unescape(
                    _line.slice(SECTION_START.length, -SECTION_END.length)
                ).trim();
                continue;
            }

            if (_line.includes(FIELD_SEPARATOR)) {
                const [
                    key,
                    ...values
                ] = _line.split(FIELD_SEPARATOR);

                const _key = this.#unescape(
                    key
                ).trim();

                let value = values.join(FIELD_SEPARATOR).trimStart();

                if (this.#isEndEscaped(
                    value
                )) {
                    value += LINE_SEPARATOR;
                    current_multiline_key = _key;
                } else {
                    value = this.#unescape(
                        value
                    );
                }

                settings[current_module] ??= {};

                settings[current_module][_key] = value;
            }
        }

        return settings;
    }

    /**
     * @param {string} line
     * @returns {string}
     */
    #removeComments(line) {
        return this.#removeComment(
            this.#removeComment(
                line,
                COMMENT_1
            ),
            COMMENT_2
        );
    }

    /**
     * @param {string} line
     * @param {string} char
     * @returns {string}
     */
    #removeComment(line, char) {
        const parts = line.split(char);

        let _line = "";

        for (const [
            index,
            part
        ] of parts.entries()) {
            _line += part;

            if (index === parts.length - 1 || !this.#isEndEscaped(
                part
            )) {
                if (index > 0) {
                    _line = _line.trimEnd();
                }
                break;
            }

            _line += char;
        }

        return _line;
    }

    /**
     * @param {Settings} settings
     * @returns {Promise<string>}
     */
    async #stringify(settings) {
        return Object.entries({
            "": {},
            ...settings
        }).reduce((ini, [
            module,
            keys
        ]) => {
            const values = Object.entries(keys);

            if (values.length === 0) {
                return ini;
            }

            return `${ini}${module !== DEFAULT_MODULE ? `${ini.length > 0 ? LINE_SEPARATOR : ""}${SECTION_START}${this.#escape(
                module
            )}${SECTION_END}${LINE_SEPARATOR}` : ""}${values.map(([
                key,
                value
            ]) => `${this.#escape(
                key
            )}${FIELD_SEPARATOR}${this.#escape(
                value
            )}${LINE_SEPARATOR}`).join("")}`;
        }, "");
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    #unescape(value) {
        return Array.from(ESCAPE_CHARS).reverse().reduce((_value, char) => _value.replaceAll(`${ESCAPE_CHAR}${char}`, char), value);
    }
}
