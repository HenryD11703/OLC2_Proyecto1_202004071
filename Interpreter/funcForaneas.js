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

        this.nodo.params.forEach
    }
}