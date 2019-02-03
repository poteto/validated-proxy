import { check, gen, Generator, property } from 'testcheck';
import validatorLookup, {
  defaultValidatorMessage,
  ValidatorFunction
} from '../../src/utils/validator-lookup';
import ValidationResult from '../../src/validation-result';

const validationResultGen: Generator<
  ValidatorFunction<unknown>
> = gen.boolean.then(b => (key, value, _) => {
  return {
    message: `value is ${value}`,
    validation: b
  };
});

describe('when a validator function is in the validation map', () => {
  it('returns the function', () => {
    const spec = gen.object({ foo: validationResultGen });
    const { result } = check(
      property(spec, validationMap =>
        validatorLookup(validationMap, 'foo').every(
          v => typeof v === 'function'
        )
      )
    );
    expect(result).toBeTruthy();
  });
});

describe('when multiple validator functions', () => {
  it('returns the functions', () => {
    const spec = gen.object({
      foo: gen.array([validationResultGen, validationResultGen])
    });
    const { result } = check(
      property(spec, validationMap =>
        validatorLookup(validationMap, 'foo').every(
          v => typeof v === 'function'
        )
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
      property(spec, validationMap => {
        const validators = validatorLookup(validationMap, key);
        const { messages } = new ValidationResult(
          key,
          1,
          validators.map(validate => validate(key, 1, null))
        );
        return messages.includes(defaultValidatorMessage);
      })
    );
    expect(result).toBeTruthy();
  });
});
