import BufferedProxy, {
  BufferErrorHandler,
  BufferExecutionHandler
} from './buffered-proxy';
import validatorLookup, { ValidationMap } from './utils/validator-lookup';
import ValidationResult from './validation-result';

export interface ValidatedProxyOptions<T> {
  executionHandler?: BufferExecutionHandler<T>;
  errorHandler?: BufferErrorHandler;
  validations: ValidationMap<T>;
}

/**
 * Wraps a target object with a `BufferedProxy`. Setters will first invoke a
 * validator function, if found in a supplied validation map. The validator
 * function returns a `ValidatedResult`, and the `BufferedProxy` is set. Getters
 * will forward to the target object, first returning the error, then the
 * change, and finally the original value;
 *
 * If the result is valid, the value is set into the `BufferedProxy`'s internal
 * value cache.
 *
 * If the result is invalid, the value is set into the `BufferedProxy`'s internal
 * error cache.
 *
 * ```ts
 * const user = {
 *   name: 'Billy Bob',
 *   age: 25
 * };
 * const bufferedProxy = validatedProxy(user, {
 *   validations: {
 *     name: [
 *       validatePresence(true),
 *       validateLength({ min: 4 })
 *     ],
 *     age: [
 *       validatePresence(true),
 *       validateNumber({ gte: 18 })
 *     ]
 *   }
 * });
 * bufferedProxy.name = 'Michael Bolton';
 * user.name; // 'Billy Bob'
 * bufferedProxy.flush();
 * user.name; // 'Michael Bolton'
 * ```
 *
 * @param target
 * @param validatedProxyOptions
 */
export default function validatedProxy<T>(
  target: T,
  { errorHandler, executionHandler, validations }: ValidatedProxyOptions<T>
) {
  const buffer = new BufferedProxy(target, {
    errorHandler,
    executionHandler
  });
  return new Proxy(buffer, {
    get(targetBuffer, key, receiver) {
      const res = targetBuffer.get(key.toString() as keyof T);
      return res;
    },
    set(targetBuffer, key, value, receiver) {
      const stringifiedKey = key.toString();
      const validators = validatorLookup(validations, stringifiedKey);
      const result = new ValidationResult(
        stringifiedKey,
        value,
        validators.map(validate =>
          validate(stringifiedKey, value, target[stringifiedKey])
        )
      );
      targetBuffer.set(stringifiedKey as keyof T, result);
      return true;
    }
  });
}
