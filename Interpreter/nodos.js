class Expresion {
    constructor(){
        this.location = null
    }
}

class OperacionBinaria extends Expresion  {
    costructor({izq, der, operacion}) {
        super();
        this.izq = izq;
        this.der = der;
        this.operacion = operacion;
    }
}

class OperacionUnaria extends Expresion  {
    constructor({operando, operacion}) {
        super();
        this.operando = operando;
        this.operacion = operacion;
    }
}

class Numero extends Expresion {
    constructor({valor}) {
        super();
        this.valor = valor;
    }
}

export default {
    OperacionBinaria,
    OperacionUnaria,
    Numero
}