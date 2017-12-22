import { IValidatorFunc } from '../../src/utils/validator-lookup';
import ValidationResult from '../../src/validation-result';

const validatePresence = (): IValidatorFunc => {
  return (key, newValue, oldValue) => {
    return {
      message: `${key} must be present`,
      validation: !!newValue
    };
  };
};

export default validatePresence;
