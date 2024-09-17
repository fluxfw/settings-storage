/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class StringifyValueSettingsStorage {
    /**
     * @type {SettingsStorage}
     */
    #settings_storage;
    /**
     * @type {(value: string) => Promise<*>}
     */
    #_parse;
    /**
     * @type {(value: *) => Promise<string>}
     */
    #_stringify;

    /**
     * @param {SettingsStorage} settings_storage
     * @param {(value: *) => Promise<string>} stringify
     * @param {(value: string) => Promise<*>} parse
     * @returns {Promise<StringifyValueSettingsStorage>}
     */
    static async new(settings_storage, stringify, parse) {
        return new this(
            settings_storage,
            stringify,
            parse
        );
    }

    /**
     * @param {SettingsStorage} settings_storage
     * @param {(value: *) => Promise<string>} stringify
     * @param {(value: string) => Promise<*>} parse
     * @private
     */
    constructor(settings_storage, stringify, parse) {
        this.#settings_storage = settings_storage;
        this.#_stringify = stringify;
        this.#_parse = parse;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        await this.#settings_storage.delete(
            key,
            module
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAll() {
        await this.#settings_storage.deleteAll();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAllByModule(module = null) {
        await this.#settings_storage.deleteAllByModule(
            module
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        return this.#parse(
            await this.#settings_storage.get(
                key,
                null,
                module
            ),
            default_value
        );
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAll() {
        const values = [];

        for (const value of await this.#settings_storage.getAll()) {
            values.push({
                ...value,
                value: await this.#parse(
                    value.value
                )
            });
        }

        return values;
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        const values = [];

        for (const value of await this.#settings_storage.getAllByModule(
            module
        )) {
            values.push({
                ...value,
                value: await this.#parse(
                    value.value
                )
            });
        }

        return values;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#settings_storage.has(
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
        await this.#settings_storage.store(
            key,
            await this.#stringify(
                value
            ),
            module
        );
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeMultiple(values) {
        const _values = [];

        for (const value of values) {
            _values.push({
                ...value,
                value: await this.#stringify(
                    value.value
                )
            });
        }

        await this.#settings_storage.storeMultiple(
            _values
        );
    }

    /**
     * @param {string | null} value
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async #parse(value = null, default_value = null) {
        if (value === null) {
            return default_value;
        }

        return await this.#_parse(
            value
        ) ?? default_value;
    }

    /**
     * @param {*} value
     * @returns {Promise<string>}
     */
    async #stringify(value) {
        return this.#_stringify(
            value
        );
    }
}
