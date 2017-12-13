import ValidationResult from '../../validation-result';

export type IValidatorFunc = (key: PropertyKey, newValue: any, oldValue?: any) => ValidationResult;
export type IValidatorFactory = (options?: object) => IValidatorFunc;

export interface IValidationMap {
  [key: string]: IValidatorFunc;
}