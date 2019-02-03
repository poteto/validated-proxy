import { ValidKey } from '../buffered-proxy';
import { ValidationMeta } from '../validation-result';

/**
 * Function signature for validator functions. Pass in a type parameter here to
 * allow typechecking `newValue`.
 */
export type ValidatorFunction<T = unknown> = (
  key: ValidKey,
  newValue: T,
  oldValue: unknown
) => ValidationMeta;

/**
 * A validation map is an object containing the mapping between the target
 * schema and validator functions.
 */
export type ValidationMap<T> = {
  [K in keyof T]: ValidatorFunction<T[K]> | Array<ValidatorFunction<T[K]>>
};

/**
 * If no validator is found, this is the default message returned by the
 * validator function.
 *
 * @internal
 * @ignore
 */
export const defaultValidatorMessage = 'No validator found';

/**
 * If no validator is found, this is the default validation returned by the
 * validator function.
 *
 * @internal
 * @ignore
 */
export const defaultValidatorValidation = true;

/**
 * If no validator is found, this is the default validator function.
 *
 * @internal
 * @ignore
 */
export const defaultValidator: ValidatorFunction<unknown> = () => {
  return {
    message: defaultValidatorMessage,
    validation: defaultValidatorValidation
  };
};

/**
 * Looks up validator function(s) from a validator map. If none are found, fall
 * back to the `defaultValidator`.
 *
 * ```ts
 * const original = { foo: null };
 * const validationMap = {
 *   foo: validatePresence(),
 *   bar: [
 *     validatePresence(),
 *     validateLength({ gt: 2 })
 *   ]
 * };
 * validatorLookup(validationMap, 'foo'); // ValidatorFunction[]
 * ```
 *
 * @param validations
 * @param key
 */
export default function validatorLookup<T, K extends keyof T>(
  validations: ValidationMap<T>,
  key: ValidKey
): Array<ValidatorFunction<T[K]>> {
  const validator = validations[key] || defaultValidator;
  return Array.isArray(validator) ? validator : [validator];
}
