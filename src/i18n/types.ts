import type it from "./it";

/**
 * `it.ts` is the source of truth: it is written with `as const` so the shape is
 * exact, but the other languages must be allowed to use *any* string. Widen
 * collapses the literal types back to `string` while keeping the structure and
 * the function signatures intact — so a missing or misspelled key in fr/es/de
 * is a type error, but the actual wording is free.
 */
type Widen<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T extends string
    ? string
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Dict = Widen<typeof it>;
