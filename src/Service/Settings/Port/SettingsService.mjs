import { DeleteCommand } from "../Command/DeleteCommand.mjs";
import { GetAllCommand } from "../Command/GetAllCommand.mjs";
import { GetCommand } from "../Command/GetCommand.mjs";
import { ResetCommand } from "../Command/ResetCommand.mjs";
import { Settings } from "../../../Adapter/Settings/Settings.mjs";
import { StoreCommand } from "../Command/StoreCommand.mjs";

export class SettingsService {
    /**
     * @type {Settings}
     */
    #settings;

    /**
     * @param {Settings} settings
     * @returns {SettingsService}
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
     * @param {string} key
     * @returns {void}
     */
    delete(key) {
        DeleteCommand.new(
            this.#settings
        )
            .delete(
                key
            );
    }

    /**
     * @param {string} key
     * @param {*} default_value
     * @returns {*}
     */
    get(key, default_value = null) {
        return GetCommand.new(
            this.#settings
        )
            .get(
                key,
                default_value
            );
    }

    /**
     * @returns {{[key: string]: *}}
     */
    getAll() {
        return GetAllCommand.new(
            this.#settings
        ).getAll();
    }

    /**
     * @returns {void}
     */
    reset() {
        ResetCommand.new(
            this.#settings
        )
            .reset();
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {void}
     */
    store(key, value) {
        StoreCommand.new(
            this.#settings
        )
            .store(
                key,
                value
            );
    }
}
