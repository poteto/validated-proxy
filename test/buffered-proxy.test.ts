/* tslint:disable:no-implicit-dependencies */
import sinon from 'sinon';
import BufferedProxy from '../src/buffered-proxy';

describe('#set', () => {
  it('stores change internally', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set('foo', 'abc');
    expect(buffer.get('foo')).toBe('abc');
  });
});

describe('#get', () => {
  it('returns cached value or original value', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    expect(buffer.get('foo')).toBe(1);
    buffer.set('foo', 'abc');
    expect(buffer.get('foo')).toBe('abc');
  });
});

describe('#execute', () => {
  it('sets value', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set('foo', 'abc');
    buffer.execute();
    expect(original.foo).toBe('abc');
  });

  it('sets value with optional execution handler', () => {
    const spy = sinon.spy();
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original, spy);
    buffer.set('foo', 'abc');
    buffer.execute();
    expect(spy.calledOnce).toBeTruthy();
  });
});

describe('#setError', () => {
  it('stores error internally', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.setError('foo', 'abc', 'must be numbers');
    expect(buffer.get('foo')).toEqual({
      message: 'must be numbers',
      value: 'abc'
    });
  });
});

describe('get changes', () => {
  it('returns changes', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set('foo', 'abc');
    expect(buffer.changes).toEqual({ foo: 'abc' });
  });
});

describe('get errors', () => {
  it('returns errors', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.setError('foo', 'abc', 'must be numbers');
    expect(buffer.errors).toEqual({
      foo: { value: 'abc', message: 'must be numbers' }
    });
  });
});
