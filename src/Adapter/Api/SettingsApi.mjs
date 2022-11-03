/** @typedef {import("../Settings/Settings.mjs").Settings} Settings */
/** @typedef {import("../../Service/Settings/Port/SettingsService.mjs").SettingsService} SettingsService */

export class SettingsApi {
    /**
     * @type {Settings}
     */
    #settings;
    /**
     * @type {SettingsService | null}
     */
    #settings_service = null;

    /**
     * @param {string} prefix
     * @returns {Promise<SettingsApi>}
     */
    static async newWithAutoSettings(prefix = "") {
        let settings;

        try {
            settings = (await import("../Settings/StorageSettings.mjs")).StorageSettings.new(
                prefix
            );
        } catch (error) {
            console.info("Unsupported StorageSettings - Using MemorySettings fallback (", error, ")");

            settings = (await import("../Settings/MemorySettings.mjs")).MemorySettings.new();
        }

        return this.new(
            settings
        );
    }

    /**
     * @param {Settings} settings
     * @returns {SettingsApi}
     */
    static new(settings) {
        return new this(
            settings
        );
    }

    /**
     * @param {Settings} settings
     * @private
     */
    constructor(settings) {
        this.#settings = settings;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {

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
     * @returns {Promise<void>}
     */
    async reset() {
        await (await this.#getSettingsService()).reset();
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
            this.#settings
        );

        return this.#settings_service;
    }
}
