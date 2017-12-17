import BufferedProxy from './buffered-proxy';
import { IValidatedProxyOptions } from './interfaces/index';
import validatorLookup from './lib/validator-lookup';

export default function validatedProxy(
  target: object,
  { errorHandler, executionHandler, validations }: IValidatedProxyOptions
) {
  const buffer = new BufferedProxy(target, {
    errorHandler,
    executionHandler
  });
  return new Proxy(buffer, {
    set(targetBuffer, property, value, receiver) {
      const validate = validatorLookup(validations, property);
      const result = validate(property, value, target[property]);
      targetBuffer.set(property, result);
      return true;
    }
  });
}
