export default function validatorLookup(validations, key) {
  return typeof validations[key] === 'function' && validations[key];
}