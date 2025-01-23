/** - Flatten Array */
export type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T;
