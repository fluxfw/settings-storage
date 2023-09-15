/**
 * @interface
 */
export class FluxSettingsStorage {
    /**
     * @returns {Promise<boolean>}
     * @abstract
     */
    canStore() { }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<void>}
     * @abstract
     */
    delete(key, module) { }

    /**
     * @param {string | null} module
     * @returns {Promise<void>}
     * @abstract
     */
    deleteAll(module) { }

    /**
     * @returns {Promise<void>}
     * @abstract
     */
    deleteAllModules() { }

    /**
     * @param {string} key
     * @param {*} default_value
     * @param {string | null} module
     * @returns {Promise<*>}
     * @abstract
     */
    get(key, default_value, module) { }

    /**
     * @param {string | null} module
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     * @abstract
     */
    getAll(module) { }

    /**
     * @returns {Promise<{module: string, key: string, value: *}[]>}
     * @abstract
     */
    getAllModules() { }

    /**
     * @param {string} key
     * @param {string | null} module
     * @returns {Promise<boolean>}
     * @abstract
     */
    has(key, module) { }

    /**
     * @param {string} key
     * @param {*} value
     * @param {string | null} module
     * @returns {Promise<void>}
     * @abstract
     */
    store(key, value, module) { }

    /**
     * @param {{module?: string | null, key: string, value: *}[]} values
     * @returns {Promise<void>}
     * @abstract
     */
    storeAll(values) { }
}
