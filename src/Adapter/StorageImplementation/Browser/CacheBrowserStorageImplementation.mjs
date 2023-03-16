import { CONTENT_TYPE_JSON } from "../../../../../flux-http-api/src/ContentType/CONTENT_TYPE.mjs";
import { HEADER_CONTENT_TYPE } from "../../../../../flux-http-api/src/Header/HEADER.mjs";
import { StorageImplementation } from "../StorageImplementation.mjs";

const KEY_QUERY_PARAM = "key";

export class CacheBrowserStorageImplementation extends StorageImplementation {
    /**
     * @type {Cache | null}
     */
    #cache = null;
    /**
     * @type {string}
     */
    #cache_name;

    /**
     * @param {string} cache_name
     * @returns {CacheBrowserStorageImplementation}
     */
    static new(cache_name) {
        return new this(
            cache_name
        );
    }

    /**
     * @param {string} cache_name
     * @private
     */
    constructor(cache_name) {
        super();

        this.#cache_name = cache_name;
    }

    /**
     * @returns {Promise<void>}
     */
    async clear() {
        this.#cache = null;

        caches.delete(this.#cache_name);
    }

    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) {
        await (await this.#getCache()).delete(this.#getUrl(
            key
        ));
    }

    /**
     * @param {string} key
     * @returns {Promise<*>}
     */
    async get(key) {
        return (await (await this.#getCache()).match(this.#getUrl(
            key
        )))?.json();
    }

    /**
     * @returns {Promise<{[key: string]: *}>}
     */
    async getAll() {
        const cache = await this.#getCache();

        return Object.fromEntries(await Promise.all((await cache.keys()).map(async request => [
            this.#getKey(
                request
            ),
            await (await cache.match(request)).json()
        ])));
    }

    /**
     * @returns {Promise<string[]>}
     */
    async getKeys() {
        return (await (await this.#getCache()).keys()).map(request => this.#getKey(
            request
        ));
    }

    /**
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    async has(key) {
        return (await (await this.#getCache()).keys()).some(request => this.#getKey(
            request
        ) === key);
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        await this.#getCache();
    }

    /**
     * @param {string} key
     * @param {*} value
     * @returns {Promise<void>}
     */
    async store(key, value) {
        await (await this.#getCache()).put(this.#getUrl(
            key
        ), "json" in Response ? Response.json(value) : new Response(JSON.stringify(value), {
            headers: {
                [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON
            }
        }));
    }

    /**
     * @returns {Promise<Cache>}
     */
    async #getCache() {
        this.#cache ??= await caches.open(this.#cache_name);

        return this.#cache;
    }

    /**
     * @param {Request} request
     * @returns {string | null}
     */
    #getKey(request) {
        return new URL(request.url).searchParams.get(KEY_QUERY_PARAM);
    }

    /**
     * @param {string} key
     * @returns {string}
     */
    #getUrl(key) {
        return `/?${new URLSearchParams({
            [KEY_QUERY_PARAM]: key
        })}`;
    }
}
