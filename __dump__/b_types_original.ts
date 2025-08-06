// import type { GenericObject, StrictObject } from "../src/object/types";
// import type { AdvancedTypes, NormalPrimitive } from "../src/types/index";

// /** - Dot-notation keys for nested objects with unknown value (including optional properties) */
// export type DotNotationKeyStrict<T> =
//     T extends AdvancedTypes ? never
//     : T extends StrictObject ?
//         {
//             [K in keyof T & string]: NonNullable<T[K]> extends Function ? never
//             : NonNullable<T[K]> extends StrictObject ?
//                 `${K}` | `${K}.${DotNotationKey<NonNullable<T[K]>>}`
//             :	`${K}`;
//         }[keyof T & string]
//     :	never;

// /** - Dot-notation keys for nested objects with `any` value (including optional properties) */
// export type DotNotationKey<T> =
//     T extends AdvancedTypes ? never
//     : T extends GenericObject ?
//         {
//             [K in keyof T & string]: NonNullable<T[K]> extends Function ? never
//             : NonNullable<T[K]> extends GenericObject ?
//                 `${K}` | `${K}.${DotNotationKey<NonNullable<T[K]>>}`
//             :	`${K}`;
//         }[keyof T & string]
//     :	never;

// /** - Object keys where the value is an array (including optional properties) */
// export type KeyForArray<T> =
//     T extends GenericObject ?
//         {
//             [K in keyof T & string]: NonNullable<T[K]> extends Function ? never
//             : NonNullable<T[K]> extends Array<unknown> ? K
//             : never;
//         }[keyof T & string]
//     :	never;

// /** - Object keys where the value is a non-array/non-advanced type object (including optional properties) */
// export type KeyForObject<T> =
//     T extends AdvancedTypes ? never
//     : T extends GenericObject ?
//         {
//             [K in keyof T & string]: NonNullable<T[K]> extends Function ? never
//             : NonNullable<T[K]> extends GenericObject ?
//                 NonNullable<T[K]> extends AdvancedTypes ?
//                     never
//                 :	K
//             :	never;
//         }[keyof T & string]
//     :	never;

// /** - Extract only keys with string values from an object, including nested dot-notation keys. */
// export type NestedKeyString<T> =
//     T extends AdvancedTypes ? never
//     : T extends GenericObject ?
//         {
//             [K in keyof T & string]: NonNullable<T[K]> extends Function ? never
//             : NonNullable<T[K]> extends string ? K
//             : NonNullable<T[K]> extends GenericObject ?
//                 `${K}.${NestedKeyString<NonNullable<T[K]>>}`
//             :	never;
//         }[keyof T & string]
//     :	never;

// /** - Extract only primitive keys from an object, including nested dot-notation keys. */
// export type NestedPrimitiveKey<T> =
//     T extends AdvancedTypes ? never
//     : T extends GenericObject ?
//         {
//             [K in keyof T & string]: NonNullable<T[K]> extends Function ? never
//             : NonNullable<T[K]> extends NormalPrimitive ? K
//             : NonNullable<T[K]> extends GenericObject ?
//                 `${K}.${NestedPrimitiveKey<NonNullable<T[K]>>}`
//             :	never;
//         }[keyof T & string]
//     :	never;
