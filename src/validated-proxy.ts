import BufferedProxy from './buffered-proxy';
import { IValidatedProxyOptions } from './interfaces/index';
import validatorLookup from './lib/validator-lookup';

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
export default function validatedProxy(
  target: object,
  { errorHandler, executionHandler, validations }: IValidatedProxyOptions
) {
  const buffer = new BufferedProxy(target, {
    errorHandler,
    executionHandler
  });
  return new Proxy(buffer, {
    get(targetBuffer, property, receiver) {
      return targetBuffer.get(property);
    },
    set(targetBuffer, property, value, receiver) {
      const validate = validatorLookup(validations, property);
      const result = validate(property, value, target[property]);
      targetBuffer.set(property, result);
      return true;
    }
  });
}
