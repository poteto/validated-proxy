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
        new ValidationResult('foo', {
          message: '',
          validation: true,
          value: 'abc'
        })
      );
      expect(buffer.get('foo')).toBe('abc');
      expect(buffer.changes).toEqual([{ key: 'foo', value: 'abc' }]);
    });
  });

  describe('when result is invalid', () => {
    it('stores error internally', () => {
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original);
      buffer.set(
        'foo',
        new ValidationResult('foo', {
          message: 'must be numbers',
          validation: false,
          value: 'abc'
        })
      );
      expect(buffer.get('foo')).toEqual('abc');
      expect(buffer.errors).toEqual([
        { key: 'foo', message: 'must be numbers', value: 'abc' }
      ]);
    });

    it('invokes errorHandler if present', () => {
      const spy = sinon.spy();
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original, { errorHandler: spy });
      buffer.set(
        'foo',
        new ValidationResult('foo', {
          message: 'must be numbers',
          validation: false,
          value: 'abc'
        })
      );
      expect(buffer.get('foo')).toEqual('abc');
      expect(buffer.errors).toEqual([
        { key: 'foo', message: 'must be numbers', value: 'abc' }
      ]);
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
      new ValidationResult('foo', {
        message: '',
        validation: true,
        value: 'abc'
      })
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', {
        message: 'must be letters',
        validation: false,
        value: 123
      })
    );
    expect(buffer.get('bar')).toEqual(123);
    expect(buffer.get('foo')).toBe('abc'); // cached value
    expect(buffer.get('baz')).toEqual([1, 2]); // original value

    expect(buffer.errors).toEqual([
      { key: 'bar', message: 'must be letters', value: 123 }
    ]);
    expect(buffer.changes).toEqual([{ key: 'foo', value: 'abc' }]);
  });
});

describe('#flush', () => {
  it('sets value', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set(
      'foo',
      new ValidationResult('foo', {
        message: '',
        validation: true,
        value: 'abc'
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
      new ValidationResult('foo', {
        message: '',
        validation: true,
        value: 'abc'
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
      new ValidationResult('foo', {
        message: '',
        validation: true,
        value: 'abc'
      })
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', {
        message: 'must be letters',
        validation: false,
        value: 123
      })
    );
    expect(buffer.get('foo')).toBe('abc');
    expect(buffer.get('bar')).toEqual(123);
    buffer.reset();
    expect(buffer.get('foo')).toBe(1);
  });
});

describe('getters', () => {
  describe('#changes/#changed', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set(
      'foo',
      new ValidationResult('foo', {
        message: '',
        validation: true,
        value: 'abc'
      })
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', {
        message: 'must be letters',
        validation: false,
        value: 123
      })
    );

    it('returns changes as an object', () => {
      expect(buffer.changed).toEqual({ foo: 'abc' });
    });
    it('returns changes as an array', () => {
      expect(buffer.changes).toEqual([{ key: 'foo', value: 'abc' }]);
    });
  });

  describe('#errors/#errored', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set(
      'foo',
      new ValidationResult('foo', {
        message: '',
        validation: true,
        value: 'abc'
      })
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', {
        message: 'must be letters',
        validation: false,
        value: 123
      })
    );
    it('returns errors as an object', () => {
      expect(buffer.errored).toEqual({
        bar: { message: 'must be letters', value: 123 }
      });
    });
    it('returns errors as an array', () => {
      expect(buffer.errors).toEqual([
        { key: 'bar', message: 'must be letters', value: 123 }
      ]);
    });
  });
});
