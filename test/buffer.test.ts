/* tslint:disable:no-implicit-dependencies */
import sinon from 'sinon';
import Buffer from '../src/buffer';

describe('#set', () => {
  it('stores change internally', () => {
    const original = { foo: 1 };
    const buffer = new Buffer(original);
    buffer.set('foo', 'abc');
    expect(buffer.get('foo')).toBe('abc');
  });
});

describe('#get', () => {
  it('returns cached value or original value', () => {
    const original = { foo: 1 };
    const buffer = new Buffer(original);
    expect(buffer.get('foo')).toBe(1);
    buffer.set('foo', 'abc');
    expect(buffer.get('foo')).toBe('abc');
  });
});

describe('#execute', () => {
  it('sets value', () => {
    const original = { foo: 1 };
    const buffer = new Buffer(original);
    buffer.set('foo', 'abc');
    buffer.execute();
    expect(original.foo).toBe('abc');
  });

  it('sets value with optional execution handler', () => {
    const spy = sinon.spy();
    const original = { foo: 1 };
    const buffer = new Buffer(original, spy);
    buffer.set('foo', 'abc');
    buffer.execute();
    expect(spy.calledOnce).toBeTruthy();
  });
});