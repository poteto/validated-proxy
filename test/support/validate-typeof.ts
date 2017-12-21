import { IValidatorFunc } from '../../src/interfaces/index';
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
  return (key, value) =>
    new ValidationResult(key, {
      message: `${value} is not of type '${type}'`,
      validation: typeof value === type,
      value
    });
};

export default validateTypeof;
