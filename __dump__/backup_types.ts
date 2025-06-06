import type { GenericObject, StrictObject } from "../src/object/types";
import type { AdvancedTypes, NormalPrimitive } from "../src/types/index";

/** - Dot-notation keys for nested objects with unknown value (including optional properties) */
export type DotNotationKeyStrict<T> =
    T extends AdvancedTypes ? never
    : T extends StrictObject ?
        {
            [K in keyof T]-?: K extends string ?
                T[K] extends StrictObject ?
                    `${K}` | `${K}.${DotNotationKey<T[K]>}`
                :	`${K}`
            :	never;
        }[keyof T]
    :	never;

/** - Dot-notation keys for nested objects with `any` value (including optional properties) */
export type DotNotationKey<T> =
    T extends AdvancedTypes ? never
    : T extends GenericObject ?
        {
            [K in keyof T]-?: K extends string ?
                T[K] extends GenericObject ?
                    `${K}` | `${K}.${DotNotationKey<T[K]>}`
                :	`${K}`
            :	never;
        }[keyof T]
    :	never;

/** - Object keys where the value is an array (including optional properties) */
export type KeyForArray<T> =
    T extends GenericObject ?
        {
            [K in keyof T]-?: K extends string ?
                [Exclude<T[K], undefined>] extends [Array<unknown>] ?
                    K
                :	never
            :	never;
        }[keyof T]
    :	never;

/** - Object keys where the value is a non-array/non-advanced type object (including optional properties) */
export type KeyForObject<T> =
    T extends AdvancedTypes ? never
    : T extends GenericObject ?
        {
            [K in keyof T]-?: K extends string ?
                [Exclude<T[K], undefined>] extends [GenericObject] ?
                    [Exclude<T[K], undefined>] extends [AdvancedTypes] ?
                        never
                    :	K
                :	never
            :	never;
        }[keyof T]
    :	never;

/** - Extract only keys with string values from an object, including nested dot-notation keys. */
/** - Extract only keys with string values from an object, including nested dot-notation keys. */
export type NestedKeyString<T> =
    T extends AdvancedTypes ? never
    : T extends GenericObject ?
        {
            [K in keyof T]-?: K extends string ?
                [Exclude<T[K], undefined>] extends [string] ? K
                : [Exclude<T[K], undefined>] extends [GenericObject] ?
                    `${K}.${NestedKeyString<Exclude<T[K], undefined>>}` extends (
                        infer D
                    ) ?
                        D extends string ?
                            D
                        :	never
                    :	never
                :	never
            :	never;
        }[keyof T]
    :	never;

/** - Extract only primitive keys from an object, including nested dot-notation keys. */
export type NestedPrimitiveKey<T> =
    T extends AdvancedTypes ? never
    : T extends GenericObject ?
        {
            [K in keyof T]-?: K extends string ?
                [Exclude<T[K], undefined>] extends [NormalPrimitive] ? K
                : [Exclude<T[K], undefined>] extends [GenericObject] ?
                    `${K}.${NestedPrimitiveKey<Exclude<T[K], undefined>>}` extends (
                        infer D
                    ) ?
                        D extends string ?
                            D
                        :	never
                    :	never
                :	never
            :	never;
        }[keyof T]
    :	never;