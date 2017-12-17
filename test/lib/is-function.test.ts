import jsc from 'jsverify';
import isFunction from '../../src/lib/is-function';

describe('isFunction', () => {
  it('returns true if it is a function', () => {
    expect(jsc.checkForall(jsc.fn(jsc.nat), f => isFunction(f))).toBeTruthy();
  });

  it('returns false if it is not a function', () => {
    expect(jsc.checkForall(jsc.nat, f => !isFunction(f))).toBeTruthy();
  });
});
