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

/**
 * A `BufferedProxy` is a wrapper around a target object. Before values are
 * set on the `BufferedProxy`, they are first validated. If the result is valid,
 * we store the value in the cache. If it's not, we store it in our error cache.
 *
 * When ready, the `BufferedProxy` can be flushed, and the cached changes will
 * be set onto the target object with an overridable `executionHandler`.
 */
export default class BufferedProxy {
  /**
   * Overridable error handler. Invoked when a `ValidationResult` is invalid.
   */
  public errorHandler: BufferErrorHandler;

  /**
   * Overridable execution handler. Invoked when the `BufferedProxy` is flushed.
   */
  public executionHandler: BufferExecutionHandler;

  private target: object;
  private ['__changes__']: object = Object.create(null);
  private ['__errors__']: IBufferErrors = Object.create(null);
  [key: string]: any;

  /**
   * Creates a new instance of `BufferedProxy`.
   *
   * ```ts
   * const user = { name: 'Lauren' };
   * new BufferedProxy(user, \/* errorHandler *\/, \/* executionHandler *\/);
   * ```
   *
   * @param target
   * @param bufferOptions
   */
  constructor(
    target: object,
    { errorHandler, executionHandler }: IBufferOptions = {}
  ) {
    this.target = target;
    this.errorHandler = errorHandler || defaultErrorHandler;
    this.executionHandler = executionHandler || defaultExecutionHandler;
  }

  /**
   * Returns the cached changes.
   *
   * ```ts
   * bufferedProxy.changes; // { name: 'Lauren' }
   * ```
   */
  public get changes() {
    return this.__changes__;
  }

  /**
   * Returns the cached errors.
   *
   * ```ts
   * bufferedProxy.errors; // { message: 'must be letters', value: 123 }
   * ```
   */
  public get errors() {
    return this.__errors__;
  }

  /**
   * Sets a value or error into the respetive cache, after the change has been
   * validated. Invokes the `errorHandler`, if present.
   *
   * ```ts
   * const user = { name: 'Lauren' };
   * const bufferedProxy = new BufferedProxy(user);
   * bufferedProxy.set(
   *   'name',
   *   new ValidationResult('Lauren Elizabeth', {
   *     message: '',
   *     validation: true
   *   })
   * );
   * bufferedProxy.get('name'); // 'Lauren Elizabeth'
   * ```
   *
   * @param key
   * @param validationResult
   */
  public set(key: PropertyKey, { value, isValid, message }: ValidationResult) {
    if (isValid) {
      return this.setValue(key, value);
    }
    this.errorHandler(message);
    return this.setError(key, value, message);
  }

  /**
   * Applies all the changes to the target object with the `executionHanlder`,
   * then resets the cached values and errors to an empty state. The default
   * `executionHandler` is `Object.assign`, which mutates the target object
   * directly.
   *
   * ```ts
   * const user = { name: 'Lauren' };
   * const bufferedProxy = new BufferedProxy(user);
   * bufferedProxy.set(
   *   'name',
   *   new ValidationResult('Lauren Elizabeth', {
   *     message: '',
   *     validation: true
   *   })
   * );
   * bufferedProxy.flush();
   * user.name; // 'Lauren Elizabeth'
   * ```
   */
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
    if (hasOwnProperty(this, key) || this[key]) {
      return this[key];
    }
    return this.target[key];
  }

  /**
   * Resets all cached values and errors.
   *
   * ```ts
   * bufferedProxy.set(
   *   'name',
   *   new ValidationResult('Lauren Elizabeth', {
   *     message: '',
   *     validation: true
   *   })
   * );
   * bufferedProxy.reset();
   * bufferedProxy.get('name'); // 'Lauren'
   * ```
   */
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
