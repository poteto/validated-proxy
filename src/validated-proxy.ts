import Buffer from './buffer';
import { IValidatedProxyOptions } from './interfaces/index';
import validatorLookup from './validator-lookup';

export default function validatedProxy(obj: object, { validations, errorHandler }: IValidatedProxyOptions) {
  const buffer = new Buffer(obj);
  return new Proxy(buffer, {
    set(targetBuffer, property, value, receiver) {
      const {
        isValid,
        message
      } = validatorLookup(validations, property)(property, value);
      if (isValid) {
        targetBuffer.set(property, value);
      } else if (errorHandler) {
        errorHandler(message);
      }
      return true;
    }
  });
}