import hasOwnProperty from './utils/has-own-property';
import ValidationResult from './validation-result';

/**
 * The error handler is a function that is called when an invalid value is set.
 * This is in addition to the error *that is already stored in the cache. By
 * default, the error handler is a `no-op` (does nothing). You can specify a
 * custom error handler; for example, you could log error messages, send them to
 * a server, etc:
 *
 * ```ts
 * const proxy = validatedProxy(original, {
 *   errorHandler: errorMessages => { // do something here },
 *   validations: // ... });
 * ```
 */
export type BufferErrorHandler = (messages: string[]) => void;

/**
 * The execution handler is a function that is used to set the changes on the
 * target object. By default, this is `Object.assign`. You can specify a custom
 * execution handler; for example, you could use Lodash's `assign`, Ember's
 * `set`, and so forth:
 *
 * ```ts
 * const proxy = validatedProxy(original, {
 *   executionHandler: (target, changes) => { // do something here },
 *   validations: // ...
 * });
 * ```
 */
export type BufferExecutionHandler<T> = (
  target: T,
  changes: Partial<T>
) => Partial<T>;

/**
 * @ignore
 */
export type ValidKey = string;

export interface BufferError<T> {
  key: ValidKey;
  value: T;
  messages: string[];
}

export interface BufferChange<T> {
  key: ValidKey;
  value: T;
}

export interface BufferOptions<T> {
  errorHandler?: BufferErrorHandler;
  executionHandler?: BufferExecutionHandler<T>;
}

/**
 * @ignore
 */
export type BufferCache<T> = { [K in keyof T]: ValidationResult<T[K]> };

/**
 * If no execution handler is defined, this is the default.
 *
 * @internal
 * @ignore
 */
const defaultExecutionHandler = Object.assign;

/**
 * If no error handler is defined, this is the default.
 *
 * @internal
 * @ignore
 */
const defaultErrorHandler = () => {}; // tslint:disable-line no-empty

/**
 * A `BufferedProxy` is a wrapper around a target object. Before values are
 * set on the `BufferedProxy`, they are first validated. If the result is valid,
 * we store the value in the cache. If it's not, we store it in our error cache.
 * When ready, the `BufferedProxy` can be flushed, and the cached changes will
 * be set onto the target object with an overridable `executionHandler`.
 */
export default class BufferedProxy<T, K extends keyof T> {
  /**
   * Overridable error handler. Invoked when a `ValidationResult` is invalid.
   */
  public errorHandler: BufferErrorHandler;

  /**
   * Overridable execution handler. Invoked when the `BufferedProxy` is flushed.
   */
  public executionHandler: BufferExecutionHandler<T>;

  private target: T;
  private ['__cache__']: BufferCache<T> = Object.create(null);

  /**
   * Any property that is not one of the getter/setter/methods on the
   * BufferedProxy instance. The value type is `unknown` in order to avoid
   * having to predefine key/value pairs of the correct types in the target
   * object. Setting the index signature to `[key: string]: T[K]` would allow us
   * to typecheck the value that is set on the proxy. However, no
   * getters/setters/methods can be added to the class. This is the tradeoff
   * we make for this particular design pattern (class based BufferedProxy).
   */
  [key: string]: unknown;

  /**
   * Creates a new instance of `BufferedProxy`.
   *
   * ```ts
   * const user = { name: 'Lauren' };
   * new BufferedProxy(user, bufferOptions);
   * ```
   *
   * @param target
   * @param bufferOptions
   */
  constructor(
    target: T,
    { errorHandler, executionHandler }: BufferOptions<T> = {}
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
  public get changed(): Partial<T> {
    return this.validResults.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, Object.create(null));
  }

  /**
   * Returns cached errors as an object.
   *
   * ```ts
   * bufferedProxy.errored;
   * {
   *   name: {
   *     value: 'Lauren Elizabeth',
   *     messages: ['Name is too long']
   *   }
   * };
   * ```
   */
  public get errored(): { [key: string]: { value: T[K]; messages: string[] } } {
    return this.invalidResults.reduce((acc, { key, messages, value }) => {
      acc[key] = { messages, value };
      return acc;
    }, Object.create(null));
  }

  /**
   * Returns cached changes as an array.
   *
   * ```ts
   * bufferedProxy.changes; // [{ key: 'name', value: 'Lauren' }]
   * ```
   */
  public get changes(): Array<BufferChange<T[K]>> {
    return this.validResults.map(({ key, value }) => {
      return { key, value };
    });
  }

  /**
   * Returns cached errors as an array.
   *
   * ```ts
   * bufferedProxy.errors;
   * [
   *   { key: 'name', messages: ['must be letters'], value: 123 }
   * ]
   * ```
   */
  public get errors(): Array<BufferError<T[K]>> {
    return this.invalidResults.map(({ key, messages, value }) => {
      return { key, messages, value };
    });
  }

  /**
   * Sets a value or error into the cache, after the change has been
   * validated. Invokes the `errorHandler`, if present.
   *
   * ```ts
   * const user = { name: 'Lauren' };
   * const bufferedProxy = new BufferedProxy(user);
   * bufferedProxy.set(
   *   'name',
   *   new ValidationResult('name', 'Lauren Elizabeth', [
   *     {
   *       message: ['name must be greater than 3 characters'],
   *       validation: true
   *     }
   *   ])
   * );
   * bufferedProxy.get('name'); // 'Lauren Elizabeth'
   * ```
   *
   * @param key
   * @param validationResult
   */
  public set(key: K, result: ValidationResult<T[K]>): ValidationResult<T[K]> {
    if (result.isInvalid) {
      this.errorHandler(result.messages);
    }
    return this.updateCache(key, result);
  }

  /**
   * Applies all the changes to the target object with the `executionHanlder`,
   * then resets the cache to an empty state. The default `executionHandler`
   * is `Object.assign`, which mutates the target object directly.
   *
   * ```ts
   * const user = { name: 'Lauren' };
   * const bufferedProxy = new BufferedProxy(user);
   * bufferedProxy.set(\/* ... *\/);
   * bufferedProxy.flush();
   * user.name; // 'Lauren Elizabeth'
   * ```
   */
  public flush() {
    console.log(this.target, this.changed); // tslint:disable-line
    this.executionHandler(this.target, this.changed);
    this.reset();
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
  public get(key: K): T[K] | unknown {
    // return proxied values
    if (hasOwnProperty(this.cache, key)) {
      return this.cache[key].value;
    }
    // return getters/setters/methods on BufferedProxy instance
    if (this[key as string]) {
      return this[key as string];
    }
    // return original value
    return this.target[key];
  }

  /**
   * Resets the cache.
   *
   * ```ts
   * bufferedProxy.get('name'); // 'Lauren Elizabeth'
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

  private updateCache(
    key: K,
    result: ValidationResult<T[K]>
  ): ValidationResult<T[K]> {
    this.cache[key] = result;
    return result;
  }

  private get validResults() {
    const cachedValidationResults = Object.values(this.cache) as Array<
      ValidationResult<T[K]>
    >;
    return cachedValidationResults.filter(r => r.isValid);
  }

  private get invalidResults() {
    const cachedValidationResults = Object.values(this.cache) as Array<
      ValidationResult<T[K]>
    >;
    return cachedValidationResults.filter(r => r.isInvalid);
  }
}
