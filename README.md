# validated-proxy [![npm version](https://badge.fury.io/js/validated-proxy.svg)](https://badge.fury.io/js/validated-proxy) [![Build Status](https://travis-ci.org/poteto/validated-proxy.svg?branch=master)](https://travis-ci.org/poteto/validated-proxy) [![Coverage Status](https://coveralls.io/repos/github/poteto/validated-proxy/badge.svg?branch=master)](https://coveralls.io/github/poteto/validated-proxy?branch=master)

The idea behind a validated proxy is simple: it represents a set of valid changes to be applied onto any object. Each change is tested against an optional validation, and if valid, the change is stored and applied when executed.

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
import { validatePresence, validateLength, validateNumber } from '../path/to/validators';

const user = {
  name: 'Billy Bob',
  age: 25
};
const bufferedProxy = validatedProxy(user, {
  validations: {
    name: [
      validatePresence(true),
      validateLength({ min: 4 })
    ],
    age: [
      validatePresence(true),
      validateNumber({ gte: 18 })
    ]
  }
});
bufferedProxy.name = 'Michael Bolton';
user.name; // 'Billy Bob'
bufferedProxy.flush();
user.name; // 'Michael Bolton'
```

## Custom validators

A validator is a higher order function that returns a validation function. The validator can pass options to the validation function. The validation function is the function that is invoked when you set a value on the `BufferedProxy`.

Here's a simple example of creating a validator that validates if a value is of a given `type`:

```ts
import { IValidatorFunc, ValidationResult } from 'validated-proxy';

type Primitive =
  | 'boolean'
  | 'number'
  | 'string'
  | 'symbol'
  | 'null'
  | 'undefined';
type NonPrimitive = 'object';
interface IValidatorOptions {
  type: Primitive | NonPrimitive;
}

const validateTypeof = ({ type }: IValidatorOptions): IValidatorFunc => {
  return (key, value) =>
    new ValidationResult(key, {
      message: `${value} is not of type '${type}'`,
      validation: typeof value === type,
      value
    });
};

export default validateTypeof;
```