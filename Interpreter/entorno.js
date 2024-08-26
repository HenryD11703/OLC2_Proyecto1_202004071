export class Entorno {
    constructor() {
        this.variables = {};
    }

    /**
     * 
     * @param {string} id 
     * @param {string} tipo 
     * @param {any} valor 
     */
    agregarVariable(id, tipo, valor) {
        this.variables[id] = { tipo, valor };
    }

    /**
     * 
     * @param {string} id 
     * @returns 
     */
    obtenerValorVariable(id) {
        return this.variables[id]?.valor;
    }

    /**
     * 
     * @param {string} id 
     * @returns 
     */
    verificarVariableExiste(id) {
        return this.variables[id]!== undefined;
    }

    /**
     * 
     * @param {string} id 
     * @param {string} tipo 
     * @returns 
     */
    verificarVariableTipo(id, tipo) {
        return this.variables[id]?.tipo === tipo;
    }
}