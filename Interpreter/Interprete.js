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

        if (izq.tipo === null || der.tipo === null) {
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
                    console.log(
                        "Error de tipos: no se puede sumar " + izq.tipo + " con " + der.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede restar" + izq.tipo + " con" + der.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede multiplicar" +
                        izq.tipo +
                        " con" +
                        der.tipo
                    );
                    return { tipo: null, valor: null };
                }
            case "/":
                // se debe verificar que no se divida entre 0
                if (der.valor === 0) {
                    console.log("Error aritmetico: division entre 0");
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
                    console.log(
                        "Error de tipos: no se puede dividir" + izq.tipo + " con" + der.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede hacer la operacion OR entre" +
                        izq.tipo +
                        " y " +
                        der.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede hacer la operacion AND entre" +
                        izq.tipo +
                        " y " +
                        der.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede comparar" +
                        izq.tipo +
                        " con" +
                        der.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede comparar" +
                        izq.tipo +
                        " con" +
                        der.tipo
                    );
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
                    console.log(
                        `Error: Comparación inválida entre ${izq.tipo} y ${der.tipo}`
                    );
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
                    console.log(
                        `Error: Comparación inválida entre ${izq.tipo} y ${der.tipo}`
                    );
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
                    console.log(
                        `Error: Comparación inválida entre ${izq.tipo} y ${der.tipo}`
                    );
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
                    console.log(
                        `Error: Comparación inválida entre ${izq.tipo} y ${der.tipo}`
                    );
                    return { tipo: null, valor: null };
                }
            case "%":
                // El modulo solo se puede entre dos int, de cualquier otra manera sera error
                if (izq.tipo === "int" && der.tipo === "int") {
                    return { tipo: "int", valor: izq.valor % der.valor };
                } else {
                    console.log(
                        "Error de tipos: no se puede calcular el modulo entre" +
                        izq.tipo +
                        " y" +
                        der.tipo
                    );
                    return { tipo: null, valor: null };
                }
            default:
                throw new Error(`Operador ${node.operacion} no soportado`);
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
                    console.log(
                        "Error de tipos: no se puede hacer negacion a " + exp.tipo
                    );
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
                    console.log(
                        "Error de tipos: no se puede hacer negacion a " + exp.tipo
                    );
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

        //Verificar los tipos de valor y de tipo
        //tipo es la parte de la gramatica y valor.tipo seria el tipo verdadero del dato

        //en tipo es int, float, string, boolean char

        if (tipo !== valor.tipo) {
            console.log(`Error de tipos: ${tipo} no es ${valor.tipo}`);
            //Si es un error no se para aca sino que se retorna null o
            //tambien se puede asignar a la variable dada el null para que
            //el arbol se siga recorriendo y cualquier otra operacion que involucre
            //a esta variable tenga como resultado null
            this.entornoActual.agregarVariable(nombre, null, null);
        }

        this.entornoActual.agregarVariable(nombre, tipo, valor.valor);
    }

    /**
     * @type {BaseVisitor['visitReferenciaVariable']}
     */
    visitReferenciaVariable(node) {
        const nombre = node.id;
        const nativo = this.entornoActual.obtenerValorVariable(nombre);
        // nativo es un objeto { tipo: string, valor: any }
        if (nativo === undefined) {
            console.log(`Error de referencia: variable ${nombre} no declarada`);
            return new Nativo({ tipo: "null", valor: null });
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
}
