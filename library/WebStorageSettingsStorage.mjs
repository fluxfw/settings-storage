import { DEFAULT_MODULE } from "./DEFAULT_MODULE.mjs";

/** @typedef {import("./Logger/Logger.mjs").Logger} Logger */
/** @typedef {import("./ReadWriteSettingsStorage.mjs").ReadWriteSettingsStorage} ReadWriteSettingsStorage */
/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./StringifyValueSettingsStorage.mjs").StringifyValueSettingsStorage} StringifyValueSettingsStorage */
/** @typedef {import("./Value.mjs").Value} Value */

const KEY_SEPARATOR = "____";

export class WebStorageSettingsStorage {
    /**
     * @type {string}
     */
    #key_prefix;
    /**
     * @type {Logger}
     */
    #logger;
    /**
     * @type {Storage}
     */
    #storage;

    /**
     * @param {string} key_prefix
     * @param {Logger | null} logger
     * @param {boolean | null} session
     * @returns {Promise<StringifyValueSettingsStorage | null>}
     */
    static async newWithJsonStringifyValue(key_prefix, logger = null, session = null) {
        const web_storage_settings_storage = await this.new(
            key_prefix,
            logger,
            session
        );

        if (web_storage_settings_storage === null) {
            return null;
        }

        return (await import("./JsonStringifyValueSettingsStorage.mjs")).JsonStringifyValueSettingsStorage.new(
            web_storage_settings_storage
        );
    }

    /**
     * @param {string} key_prefix
     * @param {Logger | null} logger
     * @param {boolean | null} session
     * @returns {Promise<StringifyValueSettingsStorage | ReadWriteSettingsStorage>}
     */
    static async newWithJsonStringifyValueAndMemoryFallback(key_prefix, logger = null, session = null) {
        return await this.newWithJsonStringifyValue(
            key_prefix,
            logger,
            session
        ) ?? (await import("./MemorySettingsStorage.mjs")).MemorySettingsStorage.new();
    }

    /**
     * @param {string} key_prefix
     * @param {Logger | null} logger
     * @param {boolean | null} session
     * @returns {Promise<WebStorageSettingsStorage | ReadWriteSettingsStorage>}
     */
    static async newWithMemoryFallback(key_prefix, logger = null, session = null) {
        return await this.new(
            key_prefix,
            logger,
            session
        ) ?? (await import("./MemorySettingsStorage.mjs")).MemorySettingsStorage.new();
    }

    /**
     * @param {string} key_prefix
     * @param {Logger | null} logger
     * @param {boolean | null} session
     * @returns {Promise<WebStorageSettingsStorage | null>}
     */
    static async new(key_prefix, logger = null, session = null) {
        if (key_prefix.includes(KEY_SEPARATOR)) {
            throw new Error("Invalid key prefix!");
        }

        const web_storage_settings_storage = new this(
            key_prefix,
            logger ?? console
        );

        if (!web_storage_settings_storage.#init(
            session
        )) {
            return null;
        }

        return web_storage_settings_storage;
    }

    /**
     * @param {string} key_prefix
     * @param {Logger} logger
     * @private
     */
    constructor(key_prefix, logger) {
        this.#key_prefix = key_prefix;
        this.#logger = logger;
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        this.#storage.removeItem(this.#getKey(
            module,
            key
        ));
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAll() {
        for (const value of this.#getAll()) {
            await this.delete(
                value.key,
                value.module
            );
        }
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAllByModule(module = null) {
        for (const value of this.#getAll(
            module ?? DEFAULT_MODULE
        )) {
            await this.delete(
                value.key,
                value.module
            );
        }
    }

    /**
     * @param {string} key
     * @param {string | null} default_value
     * @param {string | null} module
     * @returns {Promise<string | null>}
     */
    async get(key, default_value = null, module = null) {
        return this.#storage.getItem(this.#getKey(
            module,
            key
        )) ?? default_value;
    }

    /**
     * @returns {Promise<Value[]>}
     */
    async getAll() {
        return this.#getAll();
    }

    /**
     * @param {string | null} module
     * @returns {Promise<Value[]>}
     */
    async getAllByModule(module = null) {
        return this.#getAll(
            module ?? DEFAULT_MODULE
        );
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        return this.#storage.getItem(this.#getKey(
            module,
            key
        )) !== null;
    }

    /**
     * @param {string} key
     * @param {string} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        this.#storage.setItem(this.#getKey(
            module,
            key
        ), value);
    }

    /**
     * @param {StoreValue[]} values
     * @returns {Promise<void>}
     */
    async storeMultiple(values) {
        for (const value of values) {
            await this.store(
                value.key,
                value.value,
                value.module ?? null
            );
        }
    }

    /**
     * @param {string | null} module
     * @returns {Value[]}
     */
    #getAll(module = null) {
        const values = Object.entries({
            ...this.#storage
        }).filter(([
            key
        ]) => key.startsWith(`${this.#key_prefix}${KEY_SEPARATOR}`)).map(([
            key,
            value
        ]) => {
            const [
                ,
                _module,
                ..._key
            ] = key.split(KEY_SEPARATOR);

            return {
                module: _module,
                key: _key.join(KEY_SEPARATOR),
                value
            };
        });

        if (module === null) {
            return values;
        }

        return values.filter(value => value.module === module);
    }

    /**
     * @param {string | null} module
     * @param {string} key
     * @returns {string}
     */
    #getKey(module, key) {
        if (module?.includes(KEY_SEPARATOR) ?? false) {
            throw new Error("Invalid module!");
        }

        return [
            this.#key_prefix,
            module ?? DEFAULT_MODULE,
            key
        ].join(KEY_SEPARATOR);
    }

    /**
     * @param {boolean | null} session
     * @returns {boolean}
     */
    #init(session = null) {
        return this.#initStorage(
            session
        );
    }

    /**
     * @param {boolean | null} session
     * @returns {boolean}
     */
    #initStorage(session = null) {
        try {
            const key = session ?? false ? "sessionStorage" : "localStorage";

            if ((globalThis[key]?.getItem ?? null) === null) {
                this.#logger.info(
                    `${key} is not available!`
                );
                return false;
            }

            this.#storage = globalThis[key];
        } catch (error) {
            this.#logger.error(
                "Init storage failed (",
                error,
                ")!"
            );
            return false;
        }

        return true;
    }
}
