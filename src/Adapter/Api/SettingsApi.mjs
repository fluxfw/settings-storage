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
        this.#settings_service ??= await this.#getSettingsService();
    }

    /**
     * @param {string} key
     * @returns {void}
     */
    delete(key) {
        this.#settings_service.delete(
            key
        );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {*}
     */
    get(key, default_value = null) {
        return this.#settings_service.get(
            key,
            default_value
        );
    }

    /**
     * @returns {{[key: string]: *}}
     */
    getAll() {
        return this.#settings_service.getAll();
    }

    /**
     * @returns {void}
     */
    reset() {
        this.#settings_service.reset();
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {void}
     */
    store(key, value) {
        this.#settings_service.store(
            key,
            value
        );
    }

    /**
     * @returns {Promise<SettingsService>}
     */
    async #getSettingsService() {
        return (await import("../../Service/Settings/Port/SettingsService.mjs")).SettingsService.new(
            this.#settings
        );
    }
}
