/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

/**
 * @typedef {{delete: (key: string, module?: string | null) => Promise<void>, deleteAll: (module?: string | null) => Promise<void>, deleteAllModules: () => Promise<void>, get: (key: string, default_value?: *, module?: string | null) => Promise<*>, getAll: (module?: string | null) => Promise<Value[]>, getAllModules: () => Promise<Value[]>, has: (key: string, module?: string | null) => Promise<boolean>, store: (key: string, value: *, module?: string | null) => Promise<void>, storeAll: (values: StoreValue[]) => Promise<void>}} SettingsStorage
 */
