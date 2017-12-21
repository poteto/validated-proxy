import {
  BufferErrorHandler,
  BufferExecutionHandler,
  IBufferCache,
  IBufferChange,
  IBufferError,
  IBufferOptions
} from './interfaces';
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
  private ['__cache__']: IBufferCache = Object.create(null);
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
   * Returns cached changes as an object.
   *
   * ```ts
   * bufferedProxy.changed; // { name: 'Lauren' };
   * ```
   */
  public get changed() {
    const changed = Object.create(null);
    for (const key in this.cache) {
      if (this.cache[key].isValid) {
        changed[key] = this.cache[key].value;
      }
    }
    return changed;
  }

  /**
   * Returns cached errors as an object.
   *
   * ```ts
   * bufferedProxy.errored; // { name: { value: 'Lauren', message: 'Name is too long' } };
   * ```
   */
  public get errored() {
    const errored = Object.create(null);
    for (const key in this.cache) {
      if (this.cache[key].isInvalid) {
        const { value, message } = this.cache[key];
        errored[key] = { value, message };
      }
    }
    return errored;
  }

  /**
   * Returns cached changes as an array.
   *
   * ```ts
   * bufferedProxy.changes; // [{ key: 'name', value: 'Lauren' }]
   * ```
   */
  public get changes(): IBufferChange[] {
    return this.unwrapValidResults();
  }

  /**
   * Returns cached errors as an array.
   *
   * ```ts
   * bufferedProxy.errors; // [{ key: 'name', message: 'must be letters', value: 123 }]
   * ```
   */
  public get errors(): IBufferError[] {
    return this.unwrapInvalidResults();
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
   *     key: 'name',
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
  public set(key: PropertyKey, result: ValidationResult): ValidationResult {
    if (result.isInvalid) {
      this.errorHandler(result.message);
    }
    return this.updateCache(result);
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
    const flushed = this.executionHandler(this.target, this.changed);
    this.reset();
    return flushed;
  }

  /**
   * Retrieve value or error from cache by key. Returns property on the buffered
   * proxy as a fallback, followed by the target object.
   *
   * ```ts
   * bufferedProxy.get('name'); // 'Lauren'
   * ```
   *
   * @param key
   */
  public get(key: PropertyKey) {
    if (hasOwnProperty(this.cache, key)) {
      return this.cache[key].value;
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
   *   new ValidationResult('name', {
   *     message: '',
   *     validation: true,
   *     value: 'Lauren Elizabeth'
   *   })
   * );
   * bufferedProxy.reset();
   * bufferedProxy.get('name'); // 'Lauren'
   * ```
   */
  public reset(): void {
    this.__cache__ = Object.create(null);
  }

  private get cache() {
    return this.__cache__;
  }

  private updateCache(result: ValidationResult): ValidationResult {
    this.cache[result.key] = result;
    return result;
  }

  private unwrapValidResults(): IBufferChange[] {
    const changes = [];
    for (const key in this.cache) {
      if (this.cache[key].isValid) {
        changes.push(this.unwrapValidResult(this.cache[key]));
      }
    }
    return changes;
  }

  private unwrapInvalidResults(): IBufferError[] {
    const errors = [];
    for (const key in this.cache) {
      if (this.cache[key].isInvalid) {
        errors.push(this.unwrapInvalidResult(this.cache[key]));
      }
    }
    return errors;
  }

  private unwrapValidResult({ key, value }: ValidationResult) {
    return { key, value };
  }

  private unwrapInvalidResult({ key, value, message }: ValidationResult) {
    return { key, value, message };
  }
}
