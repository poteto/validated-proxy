import ValidationResult from '../../validation-result';

export type IValidatorFunc = (
  key: PropertyKey,
  newValue: any,
  oldValue: any
) => ValidationResult;
export type IValidatorFactory = (
  options?: IValidatorFactoryOptions
) => IValidatorFunc;

export interface IValidationMap {
  [key: string]: IValidatorFunc;
}

export interface IValidatorFactoryOptions {
  [key: string]: any;
}
