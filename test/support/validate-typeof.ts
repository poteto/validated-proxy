import { IValidatorFunc } from '../../src/utils/validator-lookup';
import ValidationResult from '../../src/validation-result';

type Primitive =
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'null'
  | 'undefined';
type NonPrimitive = 'object';
interface IValidatorOptions {
  type: Primitive | NonPrimitive;
}

const validateTypeof = ({ type }: IValidatorOptions): IValidatorFunc => {
  return (key, newValue, oldValue) => {
    return {
      message: `${newValue} is not of type '${type}'`,
      validation: typeof newValue === type
    };
  };
};

export default validateTypeof;
