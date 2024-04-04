/** @typedef {import("./SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

export class FluxDefaultValueTypeSettingsStorage {
    /**
     * @type {SettingsStorage}
     */
    #settings_storage;

    /**
     * @param {SettingsStorage} settings_storage
     * @returns {Promise<SettingsStorage>}
     */
    static async new(settings_storage) {
        return new this(
            settings_storage
        );
    }

    /**
     * @param {SettingsStorage} settings_storage
     * @private
     */
    constructor(settings_storage) {
        this.#settings_storage = settings_storage;
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
        return this.#fromString(
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
        return (await this.#settings_storage.getAll()).map(value => ({
            ...value,
            value: this.#fromString(
                value.value
            )
        }));
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        return (await this.#settings_storage.getAllByModule(
            module
        )).map(value => ({
            ...value,
            value: this.#fromString(
                value.value
            )
        }));
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
            this.#toString(
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
        await this.#settings_storage.storeMultiple(
            values.map(value => ({
                ...value,
                value: this.#toString(
                    value.value
                )
            }))
        );
    }

    /**
     * @param {string | null} value
     * @param {*} default_value
     * @returns {*}
     */
    #fromString(value = null, default_value = null) {
        if (value === null) {
            return default_value;
        }

        switch (typeof default_value) {
            case "boolean":
                if ([
                    "true",
                    "yes",
                    "1"
                ].includes(value.toLowerCase())) {
                    return true;
                } else {
                    if ([
                        "false",
                        "no",
                        "0"
                    ].includes(typeof value === "string" ? value.toLowerCase() : value)) {
                        return false;
                    }
                }
                return value;

            case "number":
                if (/^-?\d+(\.\d+)?$/.test(value)) {
                    const number = parseFloat(value);
                    if (Number.isFinite(number)) {
                        return number;
                    }
                }
                return value;

            default:
                return value;
        }
    }

    /**
     * @param {*} value
     * @returns {string}
     */
    #toString(value) {
        return `${value}`;
    }
}
