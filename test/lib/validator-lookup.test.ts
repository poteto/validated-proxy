import validatorLookup from '../../src/lib/validator-lookup';
import validatePresence from '../support/validate-presence';

describe('when a validator function is in the validation map', () => {
  it('returns the function', () => {
    const validationMap = { foo: validatePresence() };
    expect(typeof validatorLookup(validationMap, 'foo')).toEqual('function');
  });
});

describe('when a validator function is not in the validation map', () => {
  it('returns the function', () => {
    const validationMap = { bar: validatePresence() };
    expect(typeof validatorLookup(validationMap, 'foo')).not.toEqual('function');
  });
});