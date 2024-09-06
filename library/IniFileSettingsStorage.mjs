import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./Settings.mjs").Settings} Settings */
/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */

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

export class IniFileSettingsStorage {
    /**
     * @param {string} file_path
     * @returns {Promise<SettingsStorage>}
     */
    static async newWithDefaultValueType(file_path) {
        return (await import("./DefaultValueTypeSettingsStorage.mjs")).DefaultValueTypeSettingsStorage.new(
            await this.new(
                file_path
            )
        );
    }

    /**
     * @param {string} file_path
     * @returns {Promise<SettingsStorage>}
     */
    static async newWithJsonStringifyValue(file_path) {
        return (await import("./JsonStringifyValueSettingsStorage.mjs")).JsonStringifyValueSettingsStorage.new(
            await this.new(
                file_path
            )
        );
    }

    /**
     * @param {string} file_path
     * @returns {Promise<SettingsStorage>}
     */
    static async new(file_path) {
        const settings_storage = new this();

        return (await import("./FileSettingsStorage.mjs")).FileSettingsStorage.new(
            file_path,
            async settings => settings_storage.#stringify(
                settings
            ),
            async settings => settings_storage.#parse(
                settings
            )
        );
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @param {string} value
     * @returns {string}
     */
    #escape(value) {
        return ESCAPE_CHARS.reduce((_value, char) => _value.replaceAll(char, `${ESCAPE_CHAR}${char}`), value);
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    #escapeRegularExpression(value) {
        return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    /**
     * @param {string} value
     * @returns {boolean}
     */
    #isEndEscaped(value) {
        return value.match(new RegExp(`${this.#escapeRegularExpression(
            ESCAPE_CHAR
        )}*$`))[0].length % 2 === 1;
    }

    /**
     * @param {string} settings
     * @returns {Promise<Settings>}
     */
    async #parse(settings) {
        const _settings = {};

        let current_module = DEFAULT_MODULE;
        let current_multiline_key = null;

        for (const line of settings.replaceAll(`\r${LINE_SEPARATOR}`, LINE_SEPARATOR).replaceAll("\r", LINE_SEPARATOR).split(LINE_SEPARATOR)) {
            const _line = this.#removeComments(
                line
            );

            if (current_multiline_key !== null) {
                const key = current_multiline_key;

                let value = `${_settings[current_module][key]}${_line}`;

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

                _settings[current_module][key] = value;
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

                _settings[current_module] ??= {};

                _settings[current_module][_key] = value;
            }
        }

        return _settings;
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
