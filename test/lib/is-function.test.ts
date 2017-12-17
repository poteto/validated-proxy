import { check, gen, property } from 'testcheck';
import isFunction from '../../src/lib/is-function';

describe('isFunction', () => {
  it('returns true if it is a function', () => {
    const spec = gen.int.then(n => () => n * n);
    const { result } = check(property(spec, f => isFunction(f)));
    expect(result).toBeTruthy();
  });

  it('returns false if it is not a function', () => {
    const spec = gen.any;
    const { result } = check(property(spec, f => !isFunction(f)));
    expect(result).toBeTruthy();
  });
});
