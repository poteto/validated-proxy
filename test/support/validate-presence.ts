import { ValidatorFunction } from '../../src/utils/validator-lookup';

const validatePresence = (): ValidatorFunction => {
  return (key, newValue, oldValue) => {
    return {
      message: `${key} must be present`,
      validation: !!newValue
    };
  };
};

export default validatePresence;
