// Esta clase representa una excepcion que se lanza cuando se encuentra un break en un bloque o ciclo
export class BreakException extends Error {
  constructor() {
    super('Break');
  }
}