/**
 * Class decorator that enables the class to be recognized by FASS.
 */
// @ts-ignore: type
declare function fass(..._): void;

/**
 * Field decorator that sets the maximum number of bytes used by data.
 */
// @ts-ignore: type
declare function bytes(n: number): Function;

/**
 * Field decorator that sets the maximum number of bytes used by data.
 */
// @ts-ignore: type
declare function bytes(min: number, max: number): Function;