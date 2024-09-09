import { BaseVisitor } from "../visitor.js";
import { Entorno } from "./entorno.js";

export class InterpretarVisitor extends BaseVisitor {
    constructor() {
        super();
        this.entornoActual = new Entorno(); //Entorno Padre
        this.consola = ""; // Cadena para imprimir en la consola
    }
    /**
     * @type {BaseVisitor['visitOperacionBinaria']}
     */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        // Primero ver si alguno de estos tiene valor null, ya que esto
        // significa que hubo un error al interpretar una de sus variables
        // pero para seguir recorriendo el arbol se retornara como resultado
        // el valor null en la operacion

        if (izq.valor === null || der.valor === null) {
            return { tipo: null, valor: null };
        }

        switch (node.op) {
            case "+":
                // return izq.valor + der.valor;
                // Es necesario cambiar el return por que este retorna
                // un numero y no un objeto con tipo y valor, por lo que es
                // necesario retornar un nativo

                // Es necesario hacer verificaciones de cada operacion y si no cumplen se retorna null
                // Para la suma:
                // int + int retorna un int
                // int + float retorna un float

                // float + float retorna float
                // float + int retorna float

                // string + string retorna string

                // Cualquier otra combinacion sera un error

                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "int", valor: izq.valor + der.valor };
                } else if (izq.tipo === "float" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor + der.valor };
                } else if (izq.tipo === "int" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor + der.valor };
                } else if (izq.tipo === "float" && der.tipo === "int") {
                    return { tipo: "float", valor: izq.valor + der.valor };
                } else if (izq.tipo === "string" && der.tipo === "string") {
                    return { tipo: "string", valor: izq.valor + der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede sumar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "-":
                // Para la resta:
                // int - int retorna int
                // int - float retorna float
                // float - float retorna float
                // float - int retorna float
                // cualquier otra combinacion es error y retorna null
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "int", valor: izq.valor - der.valor };
                } else if (izq.tipo === "float" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor - der.valor };
                } else if (izq.tipo === "int" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor - der.valor };
                } else if (izq.tipo === "float" && der.tipo === "int") {
                    return { tipo: "float", valor: izq.valor - der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede restar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "*":
                // Para la multiplicacion se hara lo mismo que en la resta
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "int", valor: izq.valor * der.valor };
                } else if (izq.tipo === "float" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor * der.valor };
                } else if (izq.tipo === "int" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor * der.valor };
                } else if (izq.tipo === "float" && der.tipo === "int") {
                    return { tipo: "float", valor: izq.valor * der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede multiplicar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "/":
                // se debe verificar que no se divida entre 0
                if (der.valor === 0) {
                    this.consola += `Error: no se pueden hacer divisiones entre 0\n`;
                    return { tipo: null, valor: null };
                }
                // se hara lo mismo que en la resta y multiplicacion
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "int", valor: izq.valor / der.valor };
                } else if (izq.tipo === "float" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor / der.valor };
                } else if (izq.tipo === "int" && der.tipo === "float") {
                    return { tipo: "float", valor: izq.valor / der.valor };
                } else if (izq.tipo === "float" && der.tipo === "int") {
                    return { tipo: "float", valor: izq.valor / der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede dividir ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "||":
                // este operador solo funciona si ambos son booleanos, si es null retornar null
                if (izq.tipo === null || der.tipo === null) {
                    return { tipo: null, valor: null };
                }
                if (izq.tipo === "boolean" && der.tipo === "boolean") {
                    return {
                        tipo: "boolean",
                        valor: Boolean(izq.valor) || Boolean(der.valor),
                    };
                } else {
                    this.consola += `Error de tipos: no se puede hacer la operacion OR entre ${izq.tipo} y ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "&&":
                if (izq.tipo === null || der.tipo === null) {
                    return { tipo: null, valor: null };
                }
                if (izq.tipo === "boolean" && der.tipo === "boolean") {
                    return {
                        tipo: "boolean",
                        valor: Boolean(izq.valor) && Boolean(der.valor),
                    };
                } else {
                    this.consola += `Error de tipos: no se puede hacer la operacion AND entre ${izq.tipo} y ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "==":
                // antes de evaluar ver si alguno de sus nodos es null y retornar null
                if (izq.tipo === null || der.tipo === null) {
                    return { tipo: null, valor: null };
                }
                // int == o != int retorna boolean
                // float == o != float retorna boolean
                // int == o!= float retorna boolean
                // float == o != int retorna boolean
                // boolean == o != boolean retorna boolean
                // string == o != string retorna boolean
                // char == o != char retorna boolean
                // cualquier otra combinacion es error y retorna null
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else if (izq.tipo === "float" && der.tipo === "float") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else if (izq.tipo === "int" && der.tipo === "float") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else if (izq.tipo === "float" && der.tipo === "int") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else if (izq.tipo === "boolean" && der.tipo === "boolean") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else if (izq.tipo === "string" && der.tipo === "string") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else if (izq.tipo === "char" && der.tipo === "char") {
                    return { tipo: "boolean", valor: izq.valor === der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "!=":
                if (izq.tipo === null || der.tipo === null) {
                    return { tipo: null, valor: null };
                }
                // se maneja igual que el ==
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else if (izq.tipo === "float" && der.tipo === "float") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else if (izq.tipo === "int" && der.tipo === "float") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else if (izq.tipo === "float" && der.tipo === "int") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else if (izq.tipo === "boolean" && der.tipo === "boolean") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else if (izq.tipo === "string" && der.tipo === "string") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else if (izq.tipo === "char" && der.tipo === "char") {
                    return { tipo: "boolean", valor: izq.valor !== der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case ">":
                if (
                    (izq.tipo === "int" && der.tipo === "int") ||
                    (izq.tipo === "float" && der.tipo === "float") ||
                    (izq.tipo === "int" && der.tipo === "float") ||
                    (izq.tipo === "float" && der.tipo === "int") ||
                    (izq.tipo === "char" && der.tipo === "char")
                ) {
                    return { tipo: "boolean", valor: izq.valor > der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "<":
                if (
                    (izq.tipo === "int" && der.tipo === "int") ||
                    (izq.tipo === "float" && der.tipo === "float") ||
                    (izq.tipo === "int" && der.tipo === "float") ||
                    (izq.tipo === "float" && der.tipo === "int") ||
                    (izq.tipo === "char" && der.tipo === "char")
                ) {
                    return { tipo: "boolean", valor: izq.valor < der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case ">=":
                if (
                    (izq.tipo === "int" && der.tipo === "int") ||
                    (izq.tipo === "float" && der.tipo === "float") ||
                    (izq.tipo === "int" && der.tipo === "float") ||
                    (izq.tipo === "float" && der.tipo === "int") ||
                    (izq.tipo === "char" && der.tipo === "char")
                ) {
                    return { tipo: "boolean", valor: izq.valor >= der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "<=":
                if (
                    (izq.tipo === "int" && der.tipo === "int") ||
                    (izq.tipo === "float" && der.tipo === "float") ||
                    (izq.tipo === "int" && der.tipo === "float") ||
                    (izq.tipo === "float" && der.tipo === "int") ||
                    (izq.tipo === "char" && der.tipo === "char")
                ) {
                    return { tipo: "boolean", valor: izq.valor <= der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede comparar ${izq.tipo} con ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "%":
                // El modulo solo se puede entre dos int, de cualquier otra manera sera error
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "int", valor: izq.valor % der.valor };
                } else {
                    this.consola += `Error de tipos: no se puede hacer modulo entre ${izq.tipo} y ${der.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            default:
                this.consola += `Error de tipos: operador ${node.op} no soportado\n`;
        }
    }

    /**
     * @type {BaseVisitor['visitOperacionUnaria']}
     */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);
        // verificar si la expresion es null
        if (exp.tipo === null) {
            return { tipo: null, valor: null };
        }
        switch (node.op) {
            case "-":
                // return -exp;
                // Se debe verificar si la expresion es un int o un float
                // si es un int se retorna un int
                // si es un float se retorna un float
                // cualquier otra combinacion sera un error
                if (exp.tipo === "int") {
                    return { tipo: "int", valor: -exp.valor };
                } else if (exp.tipo === "float") {
                    return { tipo: "float", valor: -exp.valor };
                } else {
                    this.consola += `Error de tipos: no se puede hacer negativo a ${exp.tipo}\n`;
                    return { tipo: null, valor: null };
                }
            case "!":
                // return !exp;
                // Se debe verificar si la expresion es un boolean
                // si es un boolean se retorna un boolean
                // cualquier otra combinacion sera un error
                if (exp.tipo === "boolean") {
                    return { tipo: "boolean", valor: !exp.valor };
                } else {
                    this.consola += `Error de tipos: no se puede hacer negacion a ${exp.tipo}\n`;
                    return { tipo: null, valor: null };
                }
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

        // Verificar los tipos de valor y de tipo
        // tipo es la parte de la gramática y valor.tipo sería el tipo verdadero del dato
        // en tipo es int, float, string, boolean, char

        // Conversión implícita de int a float
        if (tipo === 'float' && valor.tipo === 'int') {
            this.entornoActual.agregarVariable(nombre, tipo, parseFloat(valor.valor));
        } else if (tipo !== valor.tipo) {
            this.consola += `Error de tipos: no se puede asignar ${valor.tipo} a ${tipo}\n`;
            // Si es un error, se asigna null a la variable para que
            // el árbol se siga recorriendo y cualquier otra operación que involucre
            // a esta variable tenga como resultado null
            this.entornoActual.agregarVariable(nombre, null, null);
        } else {
            this.entornoActual.agregarVariable(nombre, tipo, valor.valor);
        }
    }
    /**
     * @type {BaseVisitor['visitReferenciaVariable']}
     */
    visitReferenciaVariable(node) {
        const nombre = node.id;
        const nativo = this.entornoActual.obtenerValorVariable(nombre);
        // nativo es un objeto { tipo: string, valor: any }
        if (nativo.tipo === null) {
            this.consola += `Error: variable ${nombre} no declarada\n`;
            return { tipo: null, valor: null };
        }
        return nativo;
    }

    /**
     * @type {BaseVisitor['visitPrint']}
     */
    visitPrint(node) {
        const args = node.args.map((arg) => arg.accept(this));
        // cada arg es un objeto { tipo: string, valor: any }

        const cadena = args
            .map((arg) => {
                if (arg.tipo === "string") {
                    return arg.valor;
                } else {
                    return `${arg.valor}`;
                }
            })
            .join(" ");

        this.consola += cadena + "\n";
    }

    /**
     * @type {BaseVisitor['visitStatement']}
     */
    visitStatement(node) {
        node.exp.accept(this);
    }

    /**
     * @type {BaseVisitor['visitNativo']}
     */
    visitNativo(node) {
        const valor = node.valor;
        const tipo = node.tipo;
        return { tipo, valor };
    }

    /**
     * @type {BaseVisitor['visitDeclaracionSimple']}
     */
    visitDeclaracionSimple(node) {
        const tipo = node.tipo;
        const nombre = node.id;
        // Esta forma de declaracion no cuenta con valor por lo que se le asignara uno por defecto
        let valor;
        switch (tipo) {
            case "int":
                valor = 0;
                break;
            case "float":
                valor = 0.0;
                break;
            case "string":
                valor = "";
                break;
            case "boolean":
                valor = true;
                break;
            case "char":
                valor = "";
                break;
            default:
                this.consola += `Error de tipos: tipo ${tipo} no soportado\n`;
        }

        this.entornoActual.agregarVariable(nombre, tipo, valor);
    }

    /**
     * @type {BaseVisitor['visitDeclaracionSinTipo']}
     */
    visitDeclaracionSinTipo(node) {
        // ver si la exp es null y asignar null para seguir recorriendo el arbol
        const nombre = node.id;
        const valor = node.valor.accept(this);

        if (valor.valor === null) {
            this.entornoActual.agregarVariable(nombre, null, null);
        }   
        // esto es facil en si por que el valor es decir el nativo ya trae el tipo que queremos
        this.entornoActual.agregarVariable(nombre, valor.tipo, valor.valor);
    }

    /**
     * @type {BaseVisitor['visitAsignacion']}
     */
    visitAsignacion(node) {
        const nombre = node.id;
        const exp = node.exp.accept(this);

        //Hacer la verificacion de que el exp.tipo sean del mismo tipo que el de la variable

        // si exp es null asignar ese valor
        if (exp.tipo === null) {
            this.entornoActual.asignarValorVariable(nombre, null);
            return { tipo: null, valor: null };
        }
        if (this.entornoActual.verificarVariableTipo(nombre, exp.tipo)) {
            this.entornoActual.asignarValorVariable(nombre, exp.valor);
            return { tipo: exp.tipo, valor: exp.valor };
        } else {
            // asignar null
            this.consola += `Error de tipos: no se puede asignar ${exp.tipo} a ${nombre}\n`;
            this.entornoActual.asignarValorVariable(nombre, null);
            return { tipo: null, valor: null };
        }
    }

    /**
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node) {
        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(entornoAnterior);

        node.dcls.forEach((dcl) => dcl.accept(this));
        
        this.entornoActual = entornoAnterior;
    }

    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {
        const condicion = node.condicion.accept(this);
        // verificar si la condicion es booleana, sino reportar el error
        if (condicion.tipo !== "boolean") {
            this.consola += `Error de tipos: la condicion debe ser booleana\n`;
            return;
        }
        if (condicion.valor) {
            node.bloqueTrue.accept(this);
            return; // Si la sentencia es true ya no se hace nada mas y solo se evalua el bloque
        }
        if (node.bloqueFalse) {
            node.bloqueFalse.accept(this);
        }
    }

    /**
     * @type {BaseVisitor['visitTernary']}
     */
    visitTernary(node) {
        const condicion = node.condicion.accept(this);
        // verificar si la condicion es booleana, sino reportar el error
        if (condicion.tipo!== "boolean") {
            this.consola += `Error de tipos: la condicion de la operacion ternaria debe ser booleana\n`;
            return { tipo: null, valor: null };
        }
        if (condicion.valor) {
            // si la expresion es verdadera se interpretara y se retornara el expTrue
            let expTrue = node.expTrue.accept(this);
            return { tipo: expTrue.tipo, valor: expTrue.valor };
        } else {
            // si la expresion es falsa se interpretara y se retornara el expFalse
            let expFalse = node.expFalse.accept(this);
            return { tipo: expFalse.tipo, valor: expFalse.valor };
        }
            
    }

    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        // Mientras la condicion sea verdadera se ejecuta el bloque
        while (node.condicion.accept(this).valor) {
            node.bloque.accept(this);
        }
    }
}
