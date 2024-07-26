# Changelog

## latest

Changes:

\-

## v2024-07-26-1

Changes:

- `Logger`

## v2024-07-08-1

Changes:

- `library` folder
- Use NodeJS `exports` in `package.json` for clean imports from subfolder

## v2024-05-16-1

Changes:

- Firefox based browsers now supports `indexedDB.databases`

## v2024-05-08-1

Changes:

- Deflux

## v2024-04-17-1

Changes:

- Create folder

## v2024-04-04-2

Changes:

- Replace `isNaN` with `isFinite`

## v2024-04-04-1

Changes:

- Remove unneded `isNaN`

## v2024-04-03-1

Changes:

- Add `!` to error logs

## v2024-03-20-1

Changes:

- Make static new async

## v2023-12-20-1

Changes:

- Only create indexDB on store (Not possible on Firefox based browsers)

## v2023-11-16-1

Changes:

- Fix

## v2023-09-22-3

Changes:

- `newWith`

## v2023-09-22-2

Changes:

- Fix

## v2023-09-22-1

Changes:

- Rename `deleteAll`, `getAll` and `storeAll`
- `FluxStringifyValueSettingsStorage`
- `FluxDefaultValueTypeSettingsStorage`

## v2023-09-21-1

Changes:

- Remove `canStore` and get `null` if variant is not available

## v2023-09-20-2

Changes:

- Fix

## v2023-09-20-1

Changes:

- Remove inline comments

## v2023-09-19-2

Changes:

- Fix

## v2023-09-19-1

Changes:

- `FluxReadWriteSettingsStorage` > (`FluxFileSettingsStorage` > (`FluxJsonFileSettingsStorage` || `FluxIniFileSettingsStorage`)) || `FluxMemorySettingsStorage`
- Switch `FluxSettingsStorage` to JsDoc and rename to `SettingsStorage`

## v2023-09-15-2

Changes:

- `FluxDefaultModuleSettingsStorage`

## v2023-09-15-1

Changes:

- Modules
- Directly supports in storage if variant is unavailable and `canStore` for check this
- Remove `getFluxSettingsStorage` and `getKeys`
- Remove cache api variant

## v2023-09-11-1

Changes:

- Simplify

## v2023-07-18-1

Changes:

- `getFluxSettingsStorage`

## v2023-07-17-1

Changes:

- Simplify
- Renamed to `flux-setting-storage`

## v2023-04-11-1

Changes:

- Remove extends interface

## v2023-03-17-1

Changes:

- Simplify

## v2023-03-16-1

Changes:

- `flux-http-api`

## v2023-02-27-1

Changes:

- Remove legacy fallbacks

## v2023-02-09-1

Changes:

- build / publish

## v2023-01-31-1

Changes:

- query params

## v2023-01-03-1

Changes:

- `flux-http-api`

## v2022-12-21-1

Changes:

- `getKeys`

## v2022-12-20-3

Changes:

- Move `getImplementation`

## v2022-12-20-2

Changes:

- Check json file exists

## v2022-12-20-1

Changes:

- Fix fallbacks for private mode may not work

## v2022-12-08-1

Changes:

- `metadata.json`

## v2022-12-05-2

Changes:

- implementations

## v2022-12-05-1

Changes:

- NodeJs implementations (Json file, mongo db collection)
- Renamed browser implementations

## v2022-12-01-1

Changes:

- rename implementation

## v2022-11-24-1

Changes:

- Remove empty `init`

## v2022-11-23-2

Changes:

- Fixes

## v2022-11-23-1

Changes:

- `CacheImplementation`

## v2022-11-22-2

Changes:

- `getImplementation`

## v2022-11-22-1

Changes:

- `IndexedDBImplementation`
- `clear` / `has`

## v2022-11-03-1

Changes:

- init

## v2022-10-17-1

Changes:

- Dynamic imports

## v2022-10-03-1

Changes:

- Code format

## v2022-09-27-1

Changes:

- First release
