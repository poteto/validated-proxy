import {
  IValidationMap,
  IValidatorFactory,
  IValidatorFunc
} from '../interfaces/index';
import ValidationResult from '../validation-result';
import isFunction from './is-function';

export const defaultValidatorMessage = 'No validator found';
export const defaultValidatorValidation = true;
export const defaultValidator: IValidatorFunc = (key, value, _) => {
  return new ValidationResult(value, {
    message: defaultValidatorMessage,
    validation: defaultValidatorValidation
  });
};

export default function validatorLookup(validations: IValidationMap, key: PropertyKey): IValidatorFunc {
  return isFunction(validations[key])
    ? validations[key]
    : defaultValidator;
}