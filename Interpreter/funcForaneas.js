import { Entorno } from "./entorno.js";
import { LlamadaFunc } from "./llamadaFunc.js";
import { Funcion } from "../nodos.js";

export class funcionesForaneas extends LlamadaFunc {
    constructor(nodo, clousure) {
        super();
        /**
         * @type {Funcion}
         */
        this.nodo = nodo;
        /**
         * @type {Entorno}
         */
        this.closure = clousure;
    }

    aridad() {
        return this.nodo.parametros.length;
    }

    /**
     * @type {LlamadaFunc['invocar']}
     */
    invocar(interpretar,args){
        const entornoNuevo = new Entorno(this.closure);

        // el nodo.params es un array, dicho array contiene objetos de esta manera
        // { tipo, id } donde tipo es el tipo de dato y id es el nombre de la variable
        // modificar esto para el forEach
        this.nodo.params.forEach((parametro, index) => {
            const valor = interpretar(parametro, args[index]);
            entornoNuevo.agregarVariable(parametro.id, valor);
        });

        const EntornoPrevio = interpretar.entornoActual;
        interpretar.entornoActual = entornoNuevo;

        try {
            this.nodo.bloque.accept(interpretar);
        } catch (error) {
            interpretar.entornoActual = EntornoPrevio;

            if (error instanceof ReturnException) {
                return error.valor;
            } else {
                throw error;
            }
        }

        interpretar.entornoActual = EntornoPrevio;
        return null; // Si no hay return, se retorna null


    }
}