/** @typedef {import("./StoreValue.mjs").StoreValue} StoreValue */
/** @typedef {import("./Value.mjs").Value} Value */

/**
 * @typedef {{delete: (key: string, module?: string | null) => Promise<void>, deleteAll: () => Promise<void>, deleteAllByModule: (module?: string | null) => Promise<void>, get: (key: string, default_value?: *, module?: string | null) => Promise<*>, getAll: () => Promise<Value[]>, getAllByModule: (module?: string | null) => Promise<Value[]>, has: (key: string, module?: string | null) => Promise<boolean>, store: (key: string, value: *, module?: string | null) => Promise<void>, storeMultiple: (values: StoreValue[]) => Promise<void>}} SettingsStorage
 */
