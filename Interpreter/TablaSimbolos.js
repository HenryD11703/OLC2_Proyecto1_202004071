export class TablaSimbolos {
    // Linea, columna, Identificador, Tipo, Valor
    listaSimbolos = [];
    constructor() {
        this.actual = null;
    }
    agregarSimbolo(linea, columna, identificador, tipo, valor) {
        this.listaSimbolos.push({ linea, columna, identificador, tipo, valor });
    }

    hacerHTML() {
        let html = `
        <table class="symbol-table">
            <thead>
                <tr>
                    <th>Línea</th>
                    <th>Columna</th>
                    <th>Identificador</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
        `;

        this.listaSimbolos.forEach((simbolo) => {
            let valorStr = this.stringifyValue(simbolo.valor);
            html += `
                <tr>
                    <td>${simbolo.linea}</td>
                    <td>${simbolo.columna}</td>
                    <td>${simbolo.identificador}</td>
                    <td>${simbolo.tipo}</td>
                    <td>${valorStr}</td>
                </tr>
            `;
        });

        html += `
            </tbody>
        </table>
        `;

        return html;
    }
    stringifyValue(value) {
        if (Array.isArray(value)) {
            return '[' + value.map(v => this.stringifyValue(v)).join(', ') + ']';
        } else if (typeof value === 'object' && value !== null) {
            if ('tipo' in value && 'valor' in value) {
                return this.stringifyValue(value.valor);
            }
            return JSON.stringify(value);
        } else {
            return String(value);
        }
    }
}