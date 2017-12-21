import { IBufferChange, IBufferError } from './buffered-proxy';

export interface IValidationMeta {
  value: any;
  validation: boolean;
  message?: string;
}

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

  private meta: IValidationMeta;

  /**
   * Creates a new instance of `ValidationResult`.
   *
   * ```ts
   * new ValidationResult('name', { message: 'must be a string', validation: false, value: 123 });
   * ```
   *
   * @param value
   * @param meta
   */
  constructor(key: PropertyKey, meta: IValidationMeta) {
    this.key = key;
    this.meta = meta;
  }

  /**
   * The value being validated.
   *
   * ```ts
   * validatedResult.value; // 'Lauren'
   * ```
   */
  public get value(): any {
    return this.meta.value;
  }

  /**
   * Result of the validation.
   *
   * ```ts
   * validationResult.validation; // true
   * ```
   */
  public get validation(): boolean {
    return this.meta.validation;
  }

  /**
   * Validation message for use in case of validation failure.
   *
   * ```ts
   * validationResult.message; // 'key cannot be blank'
   * ```
   */
  public get message(): string {
    return this.meta.message;
  }

  /**
   * Is the change valid?
   *
   * ```ts
   * validationResult.isValid; // true
   * ```
   */
  public get isValid(): boolean {
    return this.validation === true;
  }

  /**
   * Is the change invalid?
   *
   * ```ts
   * validationResult.isInvalid; // true
   * ```
   */
  public get isInvalid(): boolean {
    return this.validation === false;
  }
}
