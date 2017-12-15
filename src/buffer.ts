import { BufferExecutionHandler, IBufferErrors } from './interfaces/lib/buffer';
import hasOwnProperty from './lib/has-own-property';

export default class Buffer {
  public executionHandler: BufferExecutionHandler;
  private target: object;
  private ['__changes__']: object = Object.create(null);
  private ['__errors__']: IBufferErrors = Object.create(null);
  [key: string]: any;

  constructor(target: object, executionHandler = Object.assign) {
    this.target = target;
    this.executionHandler = executionHandler;
  }

  public get changes() {
    return this.__changes__;
  }

  public get errors() {
    return this.__errors__;
  }

  public set<T>(key: PropertyKey, value: T): T {
    this.changes[key] = value;
    return value;
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

  public setError<T>(key: PropertyKey, value: T, message: string): T {
    this.errors[key] = { value, message };
    return value;
  }

  public execute(): object {
    return this.executionHandler(this.target, this.changes);
  }
}
