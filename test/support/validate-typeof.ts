import { ValidatorFunction } from '../../src/utils/validator-lookup';

type Primitive =
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'null'
  | 'undefined';
type NonPrimitive = 'object';
interface ValidatorOptions {
  type: Primitive | NonPrimitive;
}

const validateTypeof = ({ type }: ValidatorOptions): ValidatorFunction => {
  return (key, newValue, oldValue) => {
    return {
      message: `${newValue} is not of type '${type}'`,
      validation: typeof newValue === type
    };
  };
};

export default validateTypeof;
