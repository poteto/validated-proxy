import { IValidationMap, IValidatorFunc } from './interfaces/index';

export default function validatorLookup(validations: IValidationMap, key: PropertyKey): IValidatorFunc {
  return typeof validations[key] === 'function' && validations[key];
}