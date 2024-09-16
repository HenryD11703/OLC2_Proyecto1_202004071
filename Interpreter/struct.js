import { LlamadaFunc } from "./llamadaFunc.js";
import { Expresion } from "../nodos.js";

export class Struct extends LlamadaFunc {

    constructor(nombre, propiedades) {
        super();
        /**
         * @type {String}
         */
        this.nombre = nombre;

        /**
         * @type {Object.<String, Expresion>}
         */
        this.propiedades = propiedades;
    }

    aridad() {
        return Object.keys(this.propiedades).length;
    }

    invocar(interprete, args) {
        // instanciar
    }

}