import { IValidationMeta } from './interfaces/lib/validation-result';

export default class ValidationResult {
  public key: PropertyKey;
  public value: any;

  private meta: IValidationMeta;

  constructor(value: any, meta: IValidationMeta) {
    this.value = value;
    this.meta = meta;
  }

  get validation(): boolean {
    return this.meta.validation;
  }

  get message(): string {
    return this.meta.message;
  }

  get isValid(): boolean {
    return this.validation === true;
  }

  get isInvalid(): boolean {
    return !this.isValid;
  }
}