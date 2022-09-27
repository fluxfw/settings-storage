/**
 * @interface
 */
export class Settings {
    /**
     * @param {string} key
     * @returns {void}
     * @abstract
     */
    delete(key) {

    }

    /**
     * @param {string} key
     * @returns {string | null}
     * @abstract
     */
    get(key) {

    }

    /**
     * @returns {{[key: string]: string}}
     * @abstract
     */
    getAll() {

    }

    /**
     * @param {string} key
     * @param {string} value
     * @returns {void}
     * @abstract
     */
    store(key, value) {

    }
}
