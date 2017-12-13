import ValidationResult from '../../validation-result';

export type IValidatorFunc = (key: string, newValue: any, oldValue: any) => ValidationResult;
export type IValidatorFactory = (options?: object) => IValidatorFunc;

export interface IValidationMap {
  [propName: string]: IValidatorFunc | IValidatorFunc[];
}