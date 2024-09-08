import { BaseVisitor } from "../visitor.js";
import { Entorno } from "./entorno.js";

export class InterpretarVisitor extends BaseVisitor {
    constructor(){
        super();
        this.entornoActual = new Entorno(); //Entorno Padre
        this.consola = '' // Cadena para imprimir en la consola
    }
    /**
     * @type {BaseVisitor['visitOperacionBinaria']}
     */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        switch (node.op) {
            case '+':
                return izq + der;
            case '-':
                return izq - der;
            case '*':
                return izq * der;
            case '/':
                if (der === 0) {
                    console.log('Division por cero');
                }
                return null
            case '||':
                return Boolean(izq) || Boolean(der);
            case '&&':
                return Boolean(izq) && Boolean(der);
            case '==':
                return izq === der;
            case '!=':
                return izq !== der;
            case '>':
                return izq > der;
            case '<':
                return izq < der;
            case '>=':
                return izq >= der;
            case '<=':
                return izq <= der;
            case '%':
                return izq % der;
            default:
                throw new Error(`Operador ${node.operacion} no soportado`);
        }
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);

        switch (node.op) {
            case '!':
                return !Boolean(exp);
            case '-':
                return -exp;
            default:
                throw new Error(`Operador ${node.op} no soportado`);
        }
    }

        
    /**
     * @type {BaseVisitor['visitNumero']}
     */
    visitNumero(node) {
        return node.valor;
    }

    /**
     * @type {BaseVisitor['visitCadena']}
     */
    visitCadena(node) {
        return node.valor;
    }

    
    /**
      * @type {BaseVisitor['visitAgrupacion']}
      */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }

    /**
     * @type {BaseVisitor['visitDeclaracionVariable']}
     */
    visitDeclaracionVariable(node) {
        const tipo = node.tipo;
        const nombre = node.id;
        const valor = node.valor.accept(this);

        this.entornoActual.agregarVariable(nombre, tipo, valor);
    }
    
    /**
     * @type {BaseVisitor['visitReferenciaVariable']}
     */
    visitReferenciaVariable(node) {
        const nombre = node.id;
        const valor = this.entornoActual.obtenerValorVariable(nombre);

        if (valor === undefined) {
            console.log(`Variable ${nombre} no definida`);
        }

        return valor;
    }

    
    /**
     * @type {BaseVisitor['visitPrint']}
     */
    visitPrint(node) {
        const args = node.args.map(arg => arg.accept(this));
        const output = args.join(' ');
        this.consola += output + '\n';
    }

    /**
     * @type {BaseVisitor['visitStatement']}
     */
    visitStatement(node) {
        node.exp.accept(this);
    }
}