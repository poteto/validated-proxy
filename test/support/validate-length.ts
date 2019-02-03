import { ValidatorFunction } from '../../src/utils/validator-lookup';

interface ValidatorOptions {
  is: number;
  min: number;
  max: number;
}

const validateLength = ({
  is,
  min,
  max
}: Partial<ValidatorOptions>): ValidatorFunction<string> => {
  return (key, newValue, oldValue) => {
    if (is) {
      return {
        message: `${key} must be exactly ${is} characters`,
        validation: is === newValue.length
      };
    }
    if (min) {
      return {
        message: `${key} must be more than ${min} characters`,
        validation: newValue.length > min
      };
    }
    if (max) {
      return {
        message: `${key} must be less than ${max} characters`,
        validation: newValue.length < max
      };
    }
    return {
      message: `${key} must be present`,
      validation: !!newValue
    };
  };
};

export default validateLength;
