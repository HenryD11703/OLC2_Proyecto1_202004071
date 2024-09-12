
/**

 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').Nativo} Nativo


 * @typedef {import('./nodos').OperacionBinaria} OperacionBinaria


 * @typedef {import('./nodos').OperacionUnaria} OperacionUnaria


 * @typedef {import('./nodos').Agrupacion} Agrupacion


 * @typedef {import('./nodos').Numero} Numero


 * @typedef {import('./nodos').DeclaracionVariable} DeclaracionVariable


 * @typedef {import('./nodos').DeclaracionSimple} DeclaracionSimple


 * @typedef {import('./nodos').DeclaracionSinTipo} DeclaracionSinTipo


 * @typedef {import('./nodos').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').Statement} Statement


 * @typedef {import('./nodos').Asignacion} Asignacion


 * @typedef {import('./nodos').Bloque} Bloque


 * @typedef {import('./nodos').If} If


 * @typedef {import('./nodos').Ternary} Ternary


 * @typedef {import('./nodos').While} While


 * @typedef {import('./nodos').For} For


 * @typedef {import('./nodos').Switch} Switch


 * @typedef {import('./nodos').Break} Break


 * @typedef {import('./nodos').Continue} Continue


 * @typedef {import('./nodos').Return} Return


 * @typedef {import('./nodos').Llamada} Llamada


 * @typedef {import('./nodos').Array} Array


 * @typedef {import('./nodos').ArraySimple} ArraySimple


 * @typedef {import('./nodos').ArrayCopia} ArrayCopia


 * @typedef {import('./nodos').AccesoVector} AccesoVector


 * @typedef {import('./nodos').AsignacionArray} AsignacionArray

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {Nativo} node
     * @returns {any}
     */
    visitNativo(node) {
        throw new Error('Metodo visitNativo no implementado');
    }
    

    /**
     * @param {OperacionBinaria} node
     * @returns {any}
     */
    visitOperacionBinaria(node) {
        throw new Error('Metodo visitOperacionBinaria no implementado');
    }
    

    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }
    

    /**
     * @param {Agrupacion} node
     * @returns {any}
     */
    visitAgrupacion(node) {
        throw new Error('Metodo visitAgrupacion no implementado');
    }
    

    /**
     * @param {Numero} node
     * @returns {any}
     */
    visitNumero(node) {
        throw new Error('Metodo visitNumero no implementado');
    }
    

    /**
     * @param {DeclaracionVariable} node
     * @returns {any}
     */
    visitDeclaracionVariable(node) {
        throw new Error('Metodo visitDeclaracionVariable no implementado');
    }
    

    /**
     * @param {DeclaracionSimple} node
     * @returns {any}
     */
    visitDeclaracionSimple(node) {
        throw new Error('Metodo visitDeclaracionSimple no implementado');
    }
    

    /**
     * @param {DeclaracionSinTipo} node
     * @returns {any}
     */
    visitDeclaracionSinTipo(node) {
        throw new Error('Metodo visitDeclaracionSinTipo no implementado');
    }
    

    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {Statement} node
     * @returns {any}
     */
    visitStatement(node) {
        throw new Error('Metodo visitStatement no implementado');
    }
    

    /**
     * @param {Asignacion} node
     * @returns {any}
     */
    visitAsignacion(node) {
        throw new Error('Metodo visitAsignacion no implementado');
    }
    

    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }
    

    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }
    

    /**
     * @param {Ternary} node
     * @returns {any}
     */
    visitTernary(node) {
        throw new Error('Metodo visitTernary no implementado');
    }
    

    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }
    

    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }
    

    /**
     * @param {Switch} node
     * @returns {any}
     */
    visitSwitch(node) {
        throw new Error('Metodo visitSwitch no implementado');
    }
    

    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }
    

    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }
    

    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }
    

    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }
    

    /**
     * @param {Array} node
     * @returns {any}
     */
    visitArray(node) {
        throw new Error('Metodo visitArray no implementado');
    }
    

    /**
     * @param {ArraySimple} node
     * @returns {any}
     */
    visitArraySimple(node) {
        throw new Error('Metodo visitArraySimple no implementado');
    }
    

    /**
     * @param {ArrayCopia} node
     * @returns {any}
     */
    visitArrayCopia(node) {
        throw new Error('Metodo visitArrayCopia no implementado');
    }
    

    /**
     * @param {AccesoVector} node
     * @returns {any}
     */
    visitAccesoVector(node) {
        throw new Error('Metodo visitAccesoVector no implementado');
    }
    

    /**
     * @param {AsignacionArray} node
     * @returns {any}
     */
    visitAsignacionArray(node) {
        throw new Error('Metodo visitAsignacionArray no implementado');
    }
    
}
