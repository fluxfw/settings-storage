/**
 * @interface
 */
export class FluxSettingsStorage {
    /**
     * @returns {Promise<void>}
     * @abstract
     */
    clear() { }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     * @abstract
     */
    delete(key) { }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     * @abstract
     */
    get(key, default_value) { }

    /**
     * @returns {Promise<{[key: string]: *}>}
     * @abstract
     */
    getAll() { }

    /**
     * @returns {Promise<string[]>}
     * @abstract
     */
    getKeys() { }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     * @abstract
     */
    has(key) { }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     * @abstract
     */
    store(key, value) { }
}
