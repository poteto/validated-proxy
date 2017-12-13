export default class ValidationResult {
  validation: boolean;
  message: string;

  constructor(validation: boolean, message: string) {
    this.validation = validation;
    this.message = message;
  }

  get isValid() {
    return this.validation === true;
  }

  get isInvalid() {
    return !this.isValid;
  }
}