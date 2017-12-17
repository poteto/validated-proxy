import { IValidationMeta } from './interfaces/lib/validation-result';

/**
 * Wrapper class for post-validation changes to a `BufferedProxy`. All validator
 * functions return an instance of this class, to allow for a single interface
 * when updating the state of a `BufferedProxy`.
 */
export default class ValidationResult {
  /**
   * The key being validated.
   *
   * ```ts
   * validatedResult.key; // 'name'
   * ```
   */
  public key: PropertyKey;

  /**
   * The value that is being set on the `BufferedProxy`.
   *
   * ```ts
   * buffer.set('name', 'Lauren', new ValidatedResult(\/* ... *\/));
   * validatedResult.value; // 'Lauren'
   * ```
   */
  public value: any;

  private meta: IValidationMeta;

  /**
   * Creates a new instance of `ValidationResult`.
   *
   * ```ts
   * new ValidationResult(123, { message: 'must be a string', validation: false });
   * ```
   *
   * @param value
   * @param meta
   */
  constructor(value: any, meta: IValidationMeta) {
    this.value = value;
    this.meta = meta;
  }

  /**
   * Result of the validation.
   *
   * ```ts
   * validationResult.validation; // true
   * ```
   */
  get validation(): boolean {
    return this.meta.validation;
  }

  /**
   * Validation message for use in case of validation failure.
   *
   * ```ts
   * validationResult.message; // 'key cannot be blank'
   * ```
   */
  get message(): string {
    return this.meta.message;
  }

  /**
   * Is the change valid?
   *
   * ```ts
   * validationResult.isValid; // true
   * ```
   */
  get isValid(): boolean {
    return this.validation === true;
  }

  /**
   * Is the change invalid?
   *
   * ```ts
   * validationResult.isInvalid; // true
   * ```
   */
  get isInvalid(): boolean {
    return !this.isValid;
  }
}
