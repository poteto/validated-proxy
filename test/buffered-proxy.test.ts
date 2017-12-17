import sinon from 'sinon';
import BufferedProxy from '../src/buffered-proxy';
import ValidationResult from '../src/validation-result';

describe('#set', () => {
  describe('when result is valid', () => {
    it('stores change internally', () => {
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original);
      buffer.set(
        'foo',
        new ValidationResult('abc', {
          message: '',
          validation: true
        })
      );
      expect(buffer.get('foo')).toBe('abc');
    });
  });

  describe('when result is invalid', () => {
    it('stores error internally', () => {
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original);
      buffer.set(
        'foo',
        new ValidationResult('abc', {
          message: 'must be numbers',
          validation: false
        })
      );
      expect(buffer.get('foo')).toEqual({
        message: 'must be numbers',
        value: 'abc'
      });
    });

    it('invokes errorHandler if present', () => {
      const spy = sinon.spy();
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original, { errorHandler: spy });
      buffer.set(
        'foo',
        new ValidationResult('abc', {
          message: 'must be numbers',
          validation: false
        })
      );
      expect(buffer.get('foo')).toEqual({
        message: 'must be numbers',
        value: 'abc'
      });
      expect(spy.calledOnce).toBeTruthy();
    });
  });
});

describe('#get', () => {
  it('returns error, cached or original value', () => {
    const original = { foo: 1, bar: 'abc', baz: [1, 2] };
    const buffer = new BufferedProxy(original);
    expect(buffer.get('foo')).toBe(1);
    buffer.set(
      'foo',
      new ValidationResult('abc', {
        message: '',
        validation: true
      })
    );
    buffer.set(
      'bar',
      new ValidationResult(123, {
        message: 'must be letters',
        validation: false
      })
    );
    expect(buffer.get('bar')).toEqual({
      // error
      message: 'must be letters',
      value: 123
    });
    expect(buffer.get('foo')).toBe('abc'); // cached value
    expect(buffer.get('baz')).toEqual([1, 2]); // original value
  });
});

describe('#flush', () => {
  it('sets value', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set(
      'foo',
      new ValidationResult('abc', {
        message: '',
        validation: true
      })
    );
    buffer.flush();
    expect(original.foo).toBe('abc');
  });

  it('sets value with optional execution handler', () => {
    const spy = sinon.spy();
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original, { executionHandler: spy });
    buffer.set(
      'foo',
      new ValidationResult('abc', {
        message: '',
        validation: true
      })
    );
    buffer.flush();
    expect(spy.calledOnce).toBeTruthy();
  });
});

describe('#reset', () => {
  it('resets all cached values', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set(
      'foo',
      new ValidationResult('abc', {
        message: '',
        validation: true
      })
    );
    buffer.set(
      'bar',
      new ValidationResult(123, {
        message: 'must be letters',
        validation: false
      })
    );
    expect(buffer.get('foo')).toBe('abc');
    expect(buffer.get('bar')).toEqual({
      message: 'must be letters',
      value: 123
    });
    buffer.reset();
    expect(buffer.get('foo')).toBe(1);
  });
});

describe('getters', () => {
  describe('#changes', () => {
    it('returns changes', () => {
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original);
      buffer.set(
        'foo',
        new ValidationResult('abc', {
          message: '',
          validation: true
        })
      );
      expect(buffer.changes).toEqual({ foo: 'abc' });
    });
  });

  describe('#errors', () => {
    it('returns errors', () => {
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original);
      buffer.set(
        'foo',
        new ValidationResult('abc', {
          message: 'must be numbers',
          validation: false
        })
      );
      expect(buffer.errors).toEqual({
        foo: { value: 'abc', message: 'must be numbers' }
      });
    });
  });
});
