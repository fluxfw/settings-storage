/**
 * @interface
 */
export class Settings {
    /**
     * @param {string} key
     * @returns {Promise<void>}
     * @abstract
     */
    delete(key) {

    }

    /**
     * @param {string} key
     * @returns {Promise<string | null>}
     * @abstract
     */
    get(key) {

    }

    /**
     * @returns {Promise<{[key: string]: string}>}
     * @abstract
     */
    getAll() {

    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {Promise<void>}
     * @abstract
     */
    store(key, value) {

    }
}
