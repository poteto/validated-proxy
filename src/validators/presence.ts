import ValidationResult from '../validation-result';

export default function validatePresence() {
  return ((key, value) => {
    return new ValidationResult(!!value, `${key} must be present`);
  });
};