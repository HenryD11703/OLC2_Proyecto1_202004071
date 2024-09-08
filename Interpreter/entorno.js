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
        if (this.verificarVariableExiste(id)) {
            return { tipo: this.variables[id].tipo, valor: this.variables[id].valor };
        } else {
            //si la variable no existe se retorna un objeto con tipo null y valor null
            console.log(`Error de referencia: variable ${id} no declarada`);
            return { tipo: null, valor: null };
        }
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

     * @param {string} id 
     * @param {string} tipo 
     * @returns 
     */
    verificarVariableTipo(id, tipo) {
        return this.variables[id]?.tipo === tipo;
    }
}