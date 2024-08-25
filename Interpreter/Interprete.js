import { BaseVisitor } from "../visitor";

export class InterpretarVisitor extends BaseVisitor {
    constructor(){
        super();
    }
    /**
     * @type {BaseVisitor['visitOperacionBinaria']}
     */
    visitOperacionBinaria(node) {
        const izquierdo = node.izq.accept(this);
        const derecho = node.der.accept(this);

        switch (node.operacion) {
            case '+':
                return izquierdo + derecho;
            case '-':
                return izquierdo - derecho;
            case '*':
                return izquierdo * derecho;
            case '/':
                if (derecho === 0) {
                    throw new Error('Division por cero');
                }
                return izquierdo / derecho;
            case '||':
                return Boolean(izquierdo) || Boolean(derecho);
            case '&&':
                return Boolean(izquierdo) && Boolean(derecho);
            case '==':
                return izquierdo === derecho;
            case '!=':
                return izquierdo !== derecho;
            case '>':
                return izquierdo > derecho;
            case '<':
                return izquierdo < derecho;
            case '>=':
                return izquierdo >= derecho;
            case '<=':
                return izquierdo <= derecho;
            case '%':
                return izquierdo % derecho;
            default:
                throw new Error(`Operador ${node.operacion} no soportado`);
        }
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        const operando = node.operando.accept(this);

        switch (node.operacion) {
            case '!':
                return !Boolean(operando);
            case '-':
                return -operando;
            default:
                throw new Error(`Operador ${node.operacion} no soportado`);
        }
    }

    /**
     * @type {BaseVisitor['visitNumero']}
     */
    visitNumero(node) {
        return node.valor;
    }
    
    /**
     * @type {BaseVisitor['visitAgrupacion']}
     */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }
}