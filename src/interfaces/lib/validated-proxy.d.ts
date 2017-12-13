import { IValidationMap } from '../index';

export type ErrorHandler = (message: string) => void;

export interface IValidatedProxyOptions {
  errorHandler?: ErrorHandler;
  validations: IValidationMap;
}