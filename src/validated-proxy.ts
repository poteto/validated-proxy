import Buffer from './buffer';
import { IValidatedProxyOptions } from './interfaces/index';
import validatorLookup from './lib/validator-lookup';

export default function validatedProxy(target: object, { validations, errorHandler, bufferExecutionHandler }: IValidatedProxyOptions) {
  const buffer = new Buffer(target, bufferExecutionHandler);
  return new Proxy(buffer, {
    set(targetBuffer, property, value, receiver) {
      const {
        isValid,
        isInvalid,
        message
      } = validatorLookup(validations, property)(property, value, target[property]);
      if (isValid) {
        targetBuffer.set(property, value);
      }
      if (isInvalid) {
        targetBuffer.setError(property, value, message);
        if (errorHandler) {
          errorHandler(message);
        }
      }
      return true;
    }
  });
}