import { check, gen, Generator, property } from 'testcheck';
import { IValidatorFunc } from '../../src/interfaces/index';
import validatorLookup, { defaultValidatorMessage } from '../../src/lib/validator-lookup';
import ValidationResult from '../../src/validation-result';
import validatePresence from '../support/validate-presence';

const validationResultGen: Generator<IValidatorFunc> = gen.boolean.then(
  b => (key, value, _) => new ValidationResult(value, {
    message: `value is ${value}`,
    validation: b
  })
);

describe('when a validator function is in the validation map', () => {
  it('returns the function', () => {
    const spec = gen.object({ foo: validationResultGen });
    const { result } = check(
      property(
        spec,
        validationMap => typeof validatorLookup(validationMap, 'foo') === 'function'
      )
    );
    expect(result).toBeTruthy();
  });
});

describe('when a validator function is not in the validation map', () => {
  it('returns the default validator', () => {
    const key = 'foo';
    const spec = gen.object({ bar: validationResultGen });
    const { result } = check(
      property(
        spec,
        validationMap => validatorLookup(validationMap, key)(key, 1, null).message === defaultValidatorMessage
      )
    );
    expect(result).toBeTruthy();
  });
});