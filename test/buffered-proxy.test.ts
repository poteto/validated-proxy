import { spy } from 'sinon';
import BufferedProxy from '../src/buffered-proxy';
import ValidationResult from '../src/validation-result';

describe('#set', () => {
  describe('when result is valid', () => {
    it('stores change internally', () => {
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original);
      buffer.set(
        'foo',
        new ValidationResult('foo', 'abc', [
          {
            message: '',
            validation: true
          }
        ])
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
        new ValidationResult('foo', 'abc', [
          {
            message: 'must be numbers',
            validation: false
          },
          {
            message: 'must be greater than 18',
            validation: false
          }
        ])
      );
      expect(buffer.get('foo')).toEqual('abc');
      expect(buffer.errors).toEqual([
        {
          key: 'foo',
          messages: ['must be numbers', 'must be greater than 18'],
          value: 'abc'
        }
      ]);
    });

    it('invokes errorHandler if present', () => {
      const spyFunc = spy();
      const original = { foo: 1 };
      const buffer = new BufferedProxy(original, { errorHandler: spyFunc });
      buffer.set(
        'foo',
        new ValidationResult('foo', 'abc', [
          {
            message: 'must be numbers',
            validation: false
          }
        ])
      );
      expect(buffer.get('foo')).toEqual('abc');
      expect(buffer.errors).toEqual([
        { key: 'foo', messages: ['must be numbers'], value: 'abc' }
      ]);
      expect(spyFunc.calledOnce).toBeTruthy();
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
      new ValidationResult('foo', 'abc', [
        {
          message: '',
          validation: true
        }
      ])
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', 123, [
        {
          message: 'must be letters',
          validation: false
        }
      ])
    );
    expect(buffer.get('bar')).toEqual(123);
    expect(buffer.get('foo')).toBe('abc'); // cached value
    expect(buffer.get('baz')).toEqual([1, 2]); // original value

    expect(buffer.errors).toEqual([
      { key: 'bar', messages: ['must be letters'], value: 123 }
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
      new ValidationResult('foo', 'abc', [
        {
          message: '',
          validation: true
        }
      ])
    );
    buffer.flush();
    expect(original.foo).toBe('abc');
  });

  it('sets value with optional execution handler', () => {
    const spyFunc = spy();
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original, { executionHandler: spyFunc });
    buffer.set(
      'foo',
      new ValidationResult('foo', 'abc', [
        {
          message: '',
          validation: true
        }
      ])
    );
    buffer.flush();
    expect(spyFunc.calledOnce).toBeTruthy();
  });
});

describe('#reset', () => {
  it('resets all cached values', () => {
    const original = { foo: 1 };
    const buffer = new BufferedProxy(original);
    buffer.set(
      'foo',
      new ValidationResult('foo', 'abc', [
        {
          message: '',
          validation: true
        }
      ])
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', 123, [
        {
          message: 'must be letters',
          validation: false
        }
      ])
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
      new ValidationResult('foo', 'abc', [
        {
          message: '',
          validation: true
        }
      ])
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', 123, [
        {
          message: 'must be letters',
          validation: false
        }
      ])
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
      new ValidationResult('foo', 'abc', [
        {
          message: '',
          validation: true
        }
      ])
    );
    buffer.set(
      'bar',
      new ValidationResult('bar', 123, [
        {
          message: 'must be letters',
          validation: false
        }
      ])
    );
    it('returns errors as an object', () => {
      expect(buffer.errored).toEqual({
        bar: { messages: ['must be letters'], value: 123 }
      });
    });
    it('returns errors as an array', () => {
      expect(buffer.errors).toEqual([
        { key: 'bar', messages: ['must be letters'], value: 123 }
      ]);
    });
  });
});
