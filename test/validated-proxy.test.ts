import { spy } from 'sinon';
import validatedProxy from '../src/validated-proxy';
import validateLength from './support/validate-length';
import validateTypeof from './support/validate-typeof';

describe('when setting a value on the proxy', () => {
  it('sets value on buffer if valid', () => {
    const original = { foo: 'a' };
    const proxy = validatedProxy(original, {
      validations: { foo: validateLength({ is: 5 }) }
    });
    proxy.foo = 'hello';
    expect(original.foo).toBe('a');
    proxy.flush();
    expect(original.foo).toBe('hello');
  });

  it('does not set value on buffer if invalid', () => {
    const original = { foo: 'a' };
    const proxy = validatedProxy(original, {
      validations: { foo: validateTypeof({ type: 'string' }) }
    });
    proxy.foo = 1;
    expect(original.foo).toBe('a');
    expect(proxy.errors).toEqual([
      { key: 'foo', messages: ["1 is not of type 'string'"], value: 1 }
    ]);
    proxy.flush();
    expect(original.foo).toBe('a');
  });

  it('invokes error handler if invalid', () => {
    const spyFunc = spy();
    const original = { foo: 'a' };
    const proxy = validatedProxy(original, {
      errorHandler: spyFunc,
      validations: { foo: validateTypeof({ type: 'string' }) }
    });
    proxy.foo = null;
    expect(original.foo).toBe('a');
    expect(spyFunc.calledOnce).toBeTruthy();
  });
});
