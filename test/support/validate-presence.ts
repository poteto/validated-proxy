import { IValidatorFunc } from '../../src/interfaces/index';
import ValidationResult from '../../src/validation-result';

const validatePresence = (): IValidatorFunc => {
  return (key, value) =>
    new ValidationResult(key, {
      message: `${key} must be present`,
      validation: !!value,
      value
    });
};

export default validatePresence;
