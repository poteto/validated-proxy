import { ValidKey } from '../buffered-proxy';

/**
 * Shorthand for `Object.prototype.hasOwnProperty`. Returns a boolean indicating
 * whether the object has the specified property as own (not inherited)
 * property. Useful when the object was created with `Object.create(null)`.
 *
 * ```ts
 * hasOwnProperty({ foo: 1 }, 'foo'); // true
 * ```
 *
 * @param obj
 * @param args
 */
export default function hasOwnProperty(
  obj: object,
  ...args: ValidKey[]
): boolean {
  return Object.prototype.hasOwnProperty.apply(obj, args);
}
