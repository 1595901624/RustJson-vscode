export class StringBuilder {
  private value: string;

  constructor(value?: string) {
    this.value = value || '';
  }

  append(str: string): void {
    this.value += str;
  }

  toString(): string {
    return this.value;
  }
}