
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class Nativo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato del nativo
 * @param {any} options.valor Valor del nativo
    */
    constructor({ tipo, valor }) {
        super();
        
        /**
         * Tipo de dato del nativo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Valor del nativo
         * @type {any}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNativo(this);
    }
}
    
export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Numero extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor Valor del numero
    */
    constructor({ valor }) {
        super();
        
        /**
         * Valor del numero
         * @type {number}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Valor inicial de la variable
    */
    constructor({ tipo, id, valor }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Valor inicial de la variable
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}
    
export class DeclaracionSimple extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
    */
    constructor({ tipo, id }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionSimple(this);
    }
}
    
export class DeclaracionSinTipo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.valor Valor inicial de la variable
    */
    constructor({ id, valor }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Valor inicial de la variable
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionSinTipo(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {Expresion}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.args Argumentos a imprimir
    */
    constructor({ args }) {
        super();
        
        /**
         * Argumentos a imprimir
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class Statement extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a ejecutar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a ejecutar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStatement(this);
    }
}
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion a asignar
    */
    constructor({ id, exp }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {Expresion}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Declaraciones y expresiones en el bloque
    */
    constructor({ dcls }) {
        super();
        
        /**
         * Declaraciones y expresiones en el bloque
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque if
 * @param {Expresion} options.bloqueTrue Bloque de codigo a ejecutar si la condicion es verdadera
 * @param {Expresion|null} options.bloqueFalse Bloque de codigo a ejecutar si la condicion es falsa (null si no se especifica)
    */
    constructor({ condicion, bloqueTrue, bloqueFalse }) {
        super();
        
        /**
         * Expresion que debe ser verdadera para ejecutar el bloque if
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Bloque de codigo a ejecutar si la condicion es verdadera
         * @type {Expresion}
        */
        this.bloqueTrue = bloqueTrue;


        /**
         * Bloque de codigo a ejecutar si la condicion es falsa (null si no se especifica)
         * @type {Expresion|null}
        */
        this.bloqueFalse = bloqueFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class Ternary extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque if
 * @param {Expresion} options.expTrue Expresion a retornar si la condicion es verdadera
 * @param {Expresion} options.expFalse Expresion a retornar si la condicion es falsa
    */
    constructor({ condicion, expTrue, expFalse }) {
        super();
        
        /**
         * Expresion que debe ser verdadera para ejecutar el bloque if
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Expresion a retornar si la condicion es verdadera
         * @type {Expresion}
        */
        this.expTrue = expTrue;


        /**
         * Expresion a retornar si la condicion es falsa
         * @type {Expresion}
        */
        this.expFalse = expFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernary(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.condicion Expresion que debe ser verdadera para ejecutar el bloque while
 * @param {Expresion} options.bloque Bloque de codigo a ejecutar mientras la condicion sea verdadera
    */
    constructor({ condicion, bloque }) {
        super();
        
        /**
         * Expresion que debe ser verdadera para ejecutar el bloque while
         * @type {Expresion}
        */
        this.condicion = condicion;


        /**
         * Bloque de codigo a ejecutar mientras la condicion sea verdadera
         * @type {Expresion}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export default { Expresion, Nativo, OperacionBinaria, OperacionUnaria, Agrupacion, Numero, DeclaracionVariable, DeclaracionSimple, DeclaracionSinTipo, ReferenciaVariable, Print, Statement, Asignacion, Bloque, If, Ternary, While }
