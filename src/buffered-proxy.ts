import {
  BufferErrorHandler,
  BufferExecutionHandler,
  IBufferErrors,
  IBufferOptions
} from './interfaces/lib/buffered-proxy';
import hasOwnProperty from './lib/has-own-property';
import ValidationResult from './validation-result';

const defaultExecutionHandler = Object.assign;
const defaultErrorHandler = () => {}; // tslint:disable-line no-empty

export default class BufferedProxy {
  public errorHandler: BufferErrorHandler;
  public executionHandler: BufferExecutionHandler;

  private target: object;
  private ['__changes__']: object = Object.create(null);
  private ['__errors__']: IBufferErrors = Object.create(null);
  [key: string]: any;

  constructor(target: object, {
    errorHandler,
    executionHandler
  }: IBufferOptions = {}) {
    this.target = target;
    this.errorHandler = errorHandler || defaultErrorHandler;
    this.executionHandler = executionHandler || defaultExecutionHandler;
  }

  public get changes() {
    return this.__changes__;
  }

  public get errors() {
    return this.__errors__;
  }

  public set(key: PropertyKey, { value, isValid, message }: ValidationResult) {
    if (isValid) {
      return this.setValue(key, value);
    }
    this.errorHandler(message);
    return this.setError(key, value, message);
  }

  public flush(): object {
    const flushed = this.executionHandler(this.target, this.changes);
    this.reset();
    return flushed;
  }

  public get(key: PropertyKey) {
    if (hasOwnProperty(this.errors, key)) {
      return this.errors[key];
    }
    if (hasOwnProperty(this.changes, key)) {
      return this.changes[key];
    }
    return this.target[key];
  }

  public reset(): void {
    this.__changes__ = Object.create(null);
    this.__errors__ = Object.create(null);
  }

  private setValue<T>(key: PropertyKey, value: T): T {
    this.changes[key] = value;
    return value;
  }

  private setError<T>(key: PropertyKey, value: T, message: string): T {
    this.errors[key] = { value, message };
    return value;
  }
}
