import jsc from 'jsverify';
import hasOwnProperty from '../../src/lib/has-own-property';

describe('when property is present on object', () => {
  it('returns true', () => {
    const spec = { foo: jsc.nat };
    expect(jsc.checkForall(jsc.record(spec), o => hasOwnProperty(o, 'foo'))).toBeTruthy();
  });
});

describe('when property is not present on object', () => {
  it('returns true', () => {
    const spec = { bar: jsc.nat };
    expect(jsc.checkForall(jsc.record(spec), o => !hasOwnProperty(o, 'foo'))).toBeTruthy();
  });
});