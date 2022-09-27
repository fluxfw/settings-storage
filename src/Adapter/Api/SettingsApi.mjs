import { MemorySettings } from "../Settings/MemorySettings.mjs";
import { Settings } from "../Settings/Settings.mjs";
import { SettingsService } from "../../Service/Settings/Port/SettingsService.mjs";
import { StorageSettings } from "../Settings/StorageSettings.mjs";

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
     * @returns {SettingsApi}
     */
    static newWithAutoSettings(prefix = "") {
        let settings;

        try {
            settings = StorageSettings.new(
                prefix
            );
        } catch (error) {
            console.info("Unsupported StorageSettings - Using MemorySettings fallback (", error, ")");

            settings = MemorySettings.new();
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
        this.#settings_service ??= this.#getSettingsService();
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
     * @returns {SettingsService}
     */
    #getSettingsService() {
        return SettingsService.new(
            this.#settings
        );
    }
}
