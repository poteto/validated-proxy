# validated-proxy [![npm version](https://badge.fury.io/js/validated-proxy.svg)](https://badge.fury.io/js/validated-proxy) [![Build Status](https://travis-ci.org/poteto/validated-proxy.svg?branch=master)](https://travis-ci.org/poteto/validated-proxy) [![Coverage Status](https://coveralls.io/repos/github/poteto/validated-proxy/badge.svg?branch=master)](https://coveralls.io/github/poteto/validated-proxy?branch=master)

A validated proxy represents a set of valid changes to be applied later onto any object. Each change is tested against an optional validation, and if valid, the change is stored and applied when executed.

## Documentation

Latest documentation is available [here](https://poteto.github.io/validated-proxy/).

## Getting started

Install using `yarn`:

```
yarn add validated-proxy
```

Or using `npm`:

```
npm install --save validated-proxy
```

Then import it and create a new validated proxy:

```ts
import { validatedProxy } from 'validated-proxy';
import {
  validatePresence,
  validateLength,
  validateNumber
} from '../path/to/validators';

const user = {
  name: 'Billy Bob',
  age: 25
};
const updatedUser = validatedProxy(user, {
  validations: {
    name: [validatePresence(true), validateLength({ min: 4 })],
    age: [validatePresence(true), validateNumber({ gte: 18 })]
  }
});

// valid changes
updatedUser.name = 'Michael Bolton';
user.name; // 'Billy Bob'
updatedUser.flush();
user.name; // 'Michael Bolton'

// invalid changes
updatedUser.name = 'a';
user.name; // 'Billy Bob'
updatedUser.errors; // [
//   { key: 'name',
//     messages: ['name must be more than 4 characters'],
//     value: 'a'
//   }
// ]
updatedUser.flush();
user.name; // 'Billy Bob'
```

## Custom validators

A validator is a higher order function that returns a validation function. The validator can pass options to the validation function. The validation function is the function that is invoked when you set a value on the `BufferedProxy`.

Here's an example of creating a validator that validates if a value is of a given `type`:

```ts
import { ValidatorFunction, ValidationResult } from 'validated-proxy';

type Primitive =
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'null'
  | 'undefined';
type NonPrimitive = 'object';
interface ValidatorOptions {
  type: Primitive | NonPrimitive;
}

const validateTypeof = ({ type }: ValidatorOptions): ValidatorFunction => {
  return (key, newValue, oldValue) => {
    return {
      message: `${newValue} is not of type '${type}'`,
      validation: typeof newValue === type
    };
  };
};

export default validateTypeof;
```

Now you can use your validator like so:

```ts
import { validatedProxy } from 'validated-proxy';
import validateTypeof from '../path/to/validateTypeof';

const user = { name: 'Billy Bob' };
const updatedUser = validatedProxy(user, {
  validations: { name: validateTypeof({ type: 'string' }) }
});

updatedUser.name = 123; // error
```

### Custom validator type safety

If you're creating a custom validator that relies on the new value to be of a certain type, you can specify it as a generic type parameter to `ValidatorFunction<T>` (where `T` is the type of your new value):

```ts
import { ValidatorFunction } from 'validated-proxy';

interface ValidatorOptions {
  is: number;
}

const validateLength = ({
  is
}: ValidatorOptions): ValidatorFunction<string> => {
  return (key, newValue, oldValue) => {
    return {
      message: `${key} must be exactly ${is} characters`,
      validation: is === newValue.length // `newValue` is a `string`
    };
  };
};

export default validateLength;
```

More examples can be seen [here](/test/support).

## Custom error handlers

The error handler is a function that is called when an invalid value is set. This is in addition to the error that is already stored in the cache. By default, the error handler is a `no-op` (does nothing). You can specify a custom error handler; for example, you could log error messages, send them to a server, etc:

```ts
const proxy = validatedProxy(original, {
  errorHandler: errorMessages => { /** do something here **/},
  validations: /** ... */
});
```

## Custom execution handlers

The execution handler is a function that is used to set the changes on the target object. By default, this is `Object.assign`. You can specify a custom execution handler; for example, you could use Lodash's `assign`, Ember's `set`, and so forth:

```ts
const proxy = validatedProxy(original, {
  executionHandler: (target, changes) => { /** do something here **/},
  validations: /** ... */
});
```
