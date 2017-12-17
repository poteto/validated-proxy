import sinon from 'sinon';
import validatedProxy from '../src/validated-proxy';
import validatePresence from './support/validate-presence';

describe('when setting a value on the proxy', () => {
  it('sets value on buffer if valid', () => {
    const original = { foo: 1 };
    const proxy = validatedProxy(original, {
      validations: { foo: validatePresence() }
    });
    proxy.foo = 'hello';
    expect(original.foo).toBe(1);
    proxy.flush();
    expect(original.foo).toBe('hello');
  });

  it('does not set value on buffer if invalid', () => {
    const original = { foo: 1 };
    const proxy = validatedProxy(original, {
      validations: { foo: validatePresence() }
    });
    proxy.foo = null;
    expect(original.foo).toBe(1);
    expect(proxy.errors).toEqual({
      foo: { message: 'foo must be present', value: null }
    });
    proxy.flush();
    expect(original.foo).toBe(1);
  });

  it('invokes error handler if invalid', () => {
    const spy = sinon.spy();
    const original = { foo: 1 };
    const proxy = validatedProxy(original, {
      errorHandler: spy,
      validations: { foo: validatePresence() }
    });
    proxy.foo = null;
    expect(original.foo).toBe(1);
    expect(spy.calledOnce).toBeTruthy();
  });
});

