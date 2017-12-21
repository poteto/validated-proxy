import { check, gen, property } from 'testcheck';
import hasOwnProperty from '../../src/utils/has-own-property';

describe('when property is present on object', () => {
  it('returns true', () => {
    const spec = gen.object({ foo: gen.int });
    const { result } = check(property(spec, o => hasOwnProperty(o, 'foo')));
    expect(result).toBeTruthy();
  });
});

describe('when property is not present on object', () => {
  it('returns true', () => {
    const spec = gen.object({ bar: gen.int });
    const { result } = check(property(spec, o => !hasOwnProperty(o, 'foo')));
    expect(result).toBeTruthy();
  });
});
