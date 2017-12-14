import { BufferExecutionHandler } from './interfaces/lib/buffer';

const { assign } = Object;

export default class Buffer {
  public executionHandler: BufferExecutionHandler;
  private target: object;
  private changes: object = {};
  [key: string]: any;

  constructor(target: object, executionHandler = assign) {
    this.target = target;
    this.executionHandler = executionHandler;
  }

  public set<T>(key: PropertyKey, value: T): T {
    this.changes[key] = value;
    return value;
  }

  public get(key: PropertyKey) {
    return this.changes[key] || this.target[key];
  }

  public execute(): object {
    return this.executionHandler(this.target, this.changes);
  }
}
