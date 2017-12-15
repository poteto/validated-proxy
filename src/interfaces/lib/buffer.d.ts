export type BufferExecutionHandler = (target: object, changes: object) => object;

export interface IBufferError {
  value: any;
  message: string;
}

export interface IBufferErrors {
  [key: string]: IBufferError;
}