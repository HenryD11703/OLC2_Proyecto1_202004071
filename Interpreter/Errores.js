export class Errores {
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

    hacerHTML() {
        let html = `
        <table class="error-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Línea</th>
                    <th>Columna</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>
        `;

        this.listaErrores.forEach((error) => {
            html += `
                <tr>
                    <td>${error.numero}</td>
                    <td>${error.descripcion}</td>
                    <td>${error.linea}</td>
                    <td>${error.columna}</td>
                    <td>${error.tipo}</td>
                </tr>
            `;
        });

        html += `
            </tbody>
        </table>
        `;

        return html;
    }
}