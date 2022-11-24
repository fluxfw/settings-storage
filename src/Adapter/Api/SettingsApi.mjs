/** @typedef {import("../Implementation/Implementation.mjs").Implementation} Implementation */
/** @typedef {import("../../Service/Settings/Port/SettingsService.mjs").SettingsService} SettingsService */

export class SettingsApi {
    /**
     * @type {Implementation}
     */
    #implementation;
    /**
     * @type {SettingsService | null}
     */
    #settings_service = null;

    /**
     * @param {Implementation} implementation
     * @returns {SettingsApi}
     */
    static new(implementation) {
        return new this(
            implementation
        );
    }

    /**
     * @param {Implementation} implementation
     * @private
     */
    constructor(implementation) {
        this.#implementation = implementation;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        await (await this.#getSettingsService()).clear();
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await (await this.#getSettingsService()).delete(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {Promise<*>}
     */
    async get(key, default_value = null) {
        return (await this.#getSettingsService()).get(
            key,
            default_value
        );
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        return (await this.#getSettingsService()).getAll();
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return (await this.#getSettingsService()).has(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await (await this.#getSettingsService()).store(
            key,
            value
        );
    }

    /**
     * @returns {Promise<SettingsService>}
     */
    async #getSettingsService() {
        this.#settings_service ??= (await import("../../Service/Settings/Port/SettingsService.mjs")).SettingsService.new(
            this.#implementation
        );

        return this.#settings_service;
    }
}
