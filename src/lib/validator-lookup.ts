import { IValidationMap, IValidatorFunc } from '../interfaces/index';
import ValidationResult from '../validation-result';

export const defaultValidatorMessage = 'No validator found';
export const defaultValidatorValidation = true;
export const defaultValidator: IValidatorFunc = (key, value, _) => {
  return new ValidationResult(key, {
    message: defaultValidatorMessage,
    validation: defaultValidatorValidation,
    value
  });
};

/**
 * Looks up a validator function from a validator map. If none are found, fall
 * back to the `defaultValidator`.
 *
 * ```ts
 * const original = { foo: null };
 * const validationMap = { foo: validatePresence() };
 * validatorLookup(validationMap, 'foo'); // IValidatorFunc
 * ```
 *
 * @param validations
 * @param key
 */
export default function validatorLookup(
  validations: IValidationMap,
  key: PropertyKey
): IValidatorFunc {
  return typeof validations[key] === 'function'
    ? validations[key]
    : defaultValidator;
}
