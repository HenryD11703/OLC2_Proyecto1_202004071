export class Erores {
    listaErrores = [];
    errorCount = 0;

    constructor() {
        this.actual = null;
    }

    agregarError(descripcion, linea, columna, tipo) {
        this.errorCount++;
        this.listaErrores.push({
            numero: this.errorCount,
            descripcion,
            linea,
            columna,
            tipo
        });
    }
}