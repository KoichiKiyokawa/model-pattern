export class ValidatableEntity<T> {
  errors: Partial<Record<keyof T, string[]>> = {}

  addError(key: keyof T, errorMessage: string) {
    if (this.errors[key] === undefined) this.errors[key] = [errorMessage]
    else this.errors[key]?.push(errorMessage)
  }

  validate(): void {}
}
