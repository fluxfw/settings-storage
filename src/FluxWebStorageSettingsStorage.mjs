/** @typedef {import("./FluxSettingsStorage.mjs").FluxSettingsStorage} FluxSettingsStorage */

const KEY_SEPARATOR = "____";

/**
 * @implements {FluxSettingsStorage}
 */
export class FluxWebStorageSettingsStorage {
    /**
     * @type {string}
     */
    #key_prefix;
    /**
     * @type {Storage | null}
     */
    #storage = null;

    /**
     * @param {string} key_prefix
     * @param {boolean | null} session
     * @returns {Promise<FluxWebStorageSettingsStorage>}
     */
    static async new(key_prefix, session = null) {
        const flux_web_storage_settings_storage = new this(
            key_prefix
        );

        await flux_web_storage_settings_storage.#init(
            session
        );

        return flux_web_storage_settings_storage;
    }

    /**
     * @param {string} key_prefix
     * @private
     */
    constructor(key_prefix) {
        this.#key_prefix = key_prefix;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async canStore() {
        return this.#canStore();
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async delete(key, module = null) {
        if (!this.#canStore()) {
            return;
        }

        this.#storage.removeItem(this.#getKey(
            key,
            module
        ));
    }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async deleteAll(module = null) {
        if (!this.#canStore()) {
            return;
        }

        for (const value of this.#getAll(
            module ?? ""
        )) {
            await this.delete(
                value.key,
                value.module
            );
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async deleteAllModules() {
        if (!this.#canStore()) {
            return;
        }

        for (const value of this.#getAll()) {
            await this.delete(
                value.key,
                value.module
            );
        }
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     */
    async get(key, default_value = null, module = null) {
        if (!this.#canStore()) {
            return default_value;
        }

        const value = this.#storage.getItem(this.#getKey(
            key,
            module
        ));

        if (value === null) {
            return default_value;
        }

        return JSON.parse(value) ?? default_value;
    }

    /**
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAll(module = null) {
        if (!this.#canStore()) {
            return [];
        }

        return this.#getAll(
            module ?? "",
            true
        );
    }

    /**
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     */
    async getAllModules() {
        if (!this.#canStore()) {
            return [];
        }

        return this.#getAll(
            null,
            true
        );
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     */
    async has(key, module = null) {
        if (!this.#canStore()) {
            return false;
        }

        return this.#storage.getItem(this.#getKey(
            key,
            module
        )) !== null;
    }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     */
    async store(key, value, module = null) {
        if (!this.#canStore()) {
            return;
        }

        this.#storage.setItem(this.#getKey(
            key,
            module
        ), JSON.stringify(value));
    }

    /**
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     */
    async storeAll(values) {
        if (!this.#canStore()) {
            return;
        }

        for (const value of values) {
            await this.store(
                value.key,
                value.value,
                value.module ?? null
            );
        }
    }

    /**
     * @returns {boolean}
     */
    #canStore() {
        return this.#storage !== null;
    }

    /**
     * @param {string | null} module
     * @param {boolean | null} parse
     * @returns {{module: string, key: string, value: *}[]}
     */
    #getAll(module = null, parse = null) {
        const _parse = parse ?? false;

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
                value: _parse ? JSON.parse(value) : value
            };
        });

        if (module === null) {
            return values;
        }

        return values.filter(value => value.module === module);
    }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {string}
     */
    #getKey(key, module = null) {
        return [
            this.#key_prefix,
            module ?? "",
            key
        ].join(KEY_SEPARATOR);
    }

    /**
     * @param {boolean | null} session
     * @returns {Promise<void>}
     */
    async #init(session = null) {
        await this.#initStorage(
            session
        );
    }

    /**
     * @param {boolean | null} session
     * @returns {Promise<void>}
     */
    async #initStorage(session = null) {
        try {
            const key = session ?? false ? "sessionStorage" : "localStorage";

            if ((globalThis[key]?.getItem ?? null) === null) {
                return;
            }

            this.#storage = globalThis[key];
        } catch (error) {
            console.error("Init storage failed (", error, ")");
        }
    }
}
