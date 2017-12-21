import ValidationResult from '../../validation-result';

export type BufferErrorHandler = (message: string) => void;
export type BufferExecutionHandler = (
  target: object,
  changes: object
) => object;

export interface IBufferError {
  key: PropertyKey;
  value: any;
  message: string;
}

export interface IBufferChange {
  key: PropertyKey;
  value: any;
}

export interface IBufferOptions {
  errorHandler?: BufferErrorHandler;
  executionHandler?: BufferExecutionHandler;
}

export interface IBufferCache {
  [key: string]: ValidationResult;
}
