import hasOwnProperty from '../../src/lib/has-own-property';

describe('when property is present on object', () => {
  it('returns true', () => {
    const o = { foo: 1 };
    expect(hasOwnProperty(o, 'foo')).toBeTruthy();
  });
});

describe('when property is not present on object', () => {
  it('returns true', () => {
    const o = {};
    expect(hasOwnProperty(o, 'foo')).toBeFalsy();
  });
});