import {
  BufferErrorHandler,
  BufferExecutionHandler,
  IValidationMap
} from './index';

export interface IValidatedProxyOptions {
  executionHandler?: BufferExecutionHandler;
  errorHandler?: BufferErrorHandler;
  validations: IValidationMap;
}
