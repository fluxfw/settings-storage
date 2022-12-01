/**
 * @interface
 */
export class StorageImplementation {
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
     * @returns {Promise<*>}
     * @abstract
     */
    get(key) { }

    /**
     * @returns {Promise<{[key: string]: *}>}
     * @abstract
     */
    getAll() { }

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
