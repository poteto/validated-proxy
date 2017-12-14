import { IValidationMap } from '../index';
import { BufferExecutionHandler } from './buffer';

export type ErrorHandler = (message: string) => void;

export interface IValidatedProxyOptions {
  bufferExecutionHandler?: BufferExecutionHandler;
  errorHandler?: ErrorHandler;
  validations: IValidationMap;
}