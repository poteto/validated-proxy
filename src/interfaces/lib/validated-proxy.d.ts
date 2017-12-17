import { IValidationMap } from '../index';
import { BufferErrorHandler, BufferExecutionHandler } from './buffered-proxy';

export interface IValidatedProxyOptions {
  executionHandler?: BufferExecutionHandler;
  errorHandler?: BufferErrorHandler;
  validations: IValidationMap;
}
