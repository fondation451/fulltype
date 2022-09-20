export class ParsingError extends Error {
  constructor() {
    super('Failure');
    this.name = 'ParsingError';
  }
}

export class StringifyingError extends Error {
  constructor() {
    super('Failure');
    this.name = 'StringifyingError';
  }
}
