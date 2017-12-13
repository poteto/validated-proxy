// TODO how do we type this hof to return an IValidatorFunc?
export default function validatorLookup(validations: object, key: PropertyKey) {
  return typeof validations[key] === 'function' && validations[key];
}