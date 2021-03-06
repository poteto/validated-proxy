import { ValidKey } from './buffered-proxy';

export interface ValidationMeta {
  validation: boolean;
  message: string;
}

/**
 * Wrapper class for post-validation changes to a `BufferedProxy`. All validator
 * functions return an instance of this class, to allow for a single interface
 * when updating the state of a `BufferedProxy`.
 */
export default class ValidationResult<T> {
  /**
   * The key being validated.
   *
   * ```ts
   * validatedResult.key; // 'name'
   * ```
   */
  public key: ValidKey;

  /**
   * The value being validated.
   *
   * ```ts
   * validatedResult.value; // 'Lauren'
   * ```
   */
  public value: T;

  /**
   * Result of the validations.
   *
   * ```ts
   * validationResult.validations;
   * [
   *   { message: 'must be a string', validation: false },
   *   { message: 'must be at least 2 characters', validation: true }
   * ];
   * ```
   */
  public validations: ValidationMeta[];

  /**
   * Creates a new instance of `ValidationResult`.
   *
   * ```ts
   * new ValidationResult('name', 123, [
   *   { message: 'must be a string', validation: false },
   *   { message: 'must be at least 2 characters', validation: true }
   * ]);
   * ```
   *
   * @param value
   * @param meta
   */
  constructor(key: ValidKey, value: T, validations: ValidationMeta[]) {
    this.key = key;
    this.value = value;
    this.validations = validations;
  }

  /**
   * Validation message for use in case of validation failure.
   *
   * ```ts
   * validationResult.message; // 'key cannot be blank'
   * ```
   */
  public get messages(): string[] {
    return this.validations.map(v => v.message);
  }

  /**
   * Is the change valid?
   *
   * ```ts
   * validationResult.isValid; // true
   * ```
   */
  public get isValid(): boolean {
    return this.validations.every(v => v.validation === true);
  }

  /**
   * Is the change invalid?
   *
   * ```ts
   * validationResult.isInvalid; // true
   * ```
   */
  public get isInvalid(): boolean {
    return !this.isValid;
  }
}
