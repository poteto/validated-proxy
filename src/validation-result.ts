export default class ValidationResult {
  public message: string;
  private validation: boolean;

  constructor(validation: boolean, message: string) {
    this.validation = validation;
    this.message = message;
  }

  get isValid(): boolean {
    return this.validation === true;
  }

  get isInvalid(): boolean {
    return !this.isValid;
  }
}