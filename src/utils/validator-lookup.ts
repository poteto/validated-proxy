import { ValidKey } from '../buffered-proxy';
import ValidationResult, { IValidationMeta } from '../validation-result';
/**
 * Function signature for validator functions.
 */
export type IValidatorFunc = (
  key: ValidKey,
  newValue: any,
  oldValue: any
) => IValidationMeta;

/**
 * A validation map is an object containing the mapping between the target
 * schema and validator functions.
 */
export interface IValidationMap {
  [key: string]: IValidatorFunc | IValidatorFunc[];
}

/**
 * If no validator is found, this is the default message returned by the
 * validator function.
 *
 * @internal
 */
export const defaultValidatorMessage = 'No validator found';

/**
 * If no validator is found, this is the default validation returned by the
 * validator function.
 *
 * @internal
 */
export const defaultValidatorValidation = true;

/**
 * If no validator is found, this is the default validator function.
 *
 * @internal
 */
export const defaultValidator: IValidatorFunc = (key, value, oldValue) => {
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
 * validatorLookup(validationMap, 'foo'); // IValidatorFunc[]
 * ```
 *
 * @param validations
 * @param key
 */
export default function validatorLookup(
  validations: IValidationMap,
  key: ValidKey
): IValidatorFunc[] {
  const validator = validations[key] || defaultValidator;
  return Array.isArray(validator) ? validator : [validator];
}
