import { LlamadaFunc } from "./llamadaFunc.js";

class FuncionesNativas extends LlamadaFunc {
    constructor(aridad, funcion){
        super();
        this.aridad = aridad;
        this.invocar = funcion;
    }
}

// System.out.println(time());
export const embebidas = {
    // recordar que cada cosa debe retornar un par de tipo y valor
    'time': new FuncionesNativas(() => 0, () => new Date().toISOString())
}