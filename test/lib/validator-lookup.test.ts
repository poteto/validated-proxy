import validatorLookup, { defaultValidatorMessage } from '../../src/lib/validator-lookup';
import validatePresence from '../support/validate-presence';

describe('when a validator function is in the validation map', () => {
  it('returns the function', () => {
    const validationMap = { foo: validatePresence() };
    expect(typeof validatorLookup(validationMap, 'foo')).toEqual('function');
  });
});

describe('when a validator function is not in the validation map', () => {
  it('returns the default validator', () => {
    const validationMap = { bar: validatePresence() };
    const validate = validatorLookup(validationMap, 'foo');
    expect(typeof validate).toEqual('function');
    expect(validate('foo', 1, null).message).toBe(defaultValidatorMessage);
  });
});