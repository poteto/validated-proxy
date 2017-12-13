import validatorLookup from './validator-lookup';

export default function changeset(obj, { validations, errorHandler }) {
  return new Proxy(obj, {
    set(target, property, value, receiver) {
      const { isValid, message } = validatorLookup(validations, property)(property, value);
      if (isValid) {
        target[property] = value;
      } else {
        errorHandler(message);
      }
      return true;
    }
  });
}