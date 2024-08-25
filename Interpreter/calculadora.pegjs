
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'numero': nodos.Numero,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
      'agrupacion': nodos.Agrupacion
    }

  }
}

//Precedencia de las Operaciones
// De mayor a menor

// () o []
// ! o - (Unaria)
// / % *
// + -
// <  <=  >= > 
// == !=
// && 
// ||

// Para crear la gramatica se tiene que iniciar en la produccion con mayor precedencia

// Ya que es a la que puede llegar directo pasando de uno en uno estas otras producciones

Expresion = OperacionOr

OperacionOr = izq:OperacionAnd expansion:( op:("||") der: OperacionAnd {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return { tipo, izq: operacionAnterior, der}
    },
    izq
  )
}

OperacionAnd = izq:OperacionComparar expansion:( op:("&&") der:OperacionComparar {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return { tipo, izq: operacionAnterior, der}
    },
    izq
  )
}   

OperacionComparar = izq:OperacionRelacional expansion:( op:("==" / "!= ") der:OperacionRelacional {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return { tipo, izq: operacionAnterior, der}
    },
    izq
  )
}   

OperacionRelacional = izq:Operacion expansion:( op:("<" / "<=" / ">=" / ">") der:Operacion {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return { tipo, izq: operacionAnterior, der}
    },
    izq
  )
}   

Operacion = izq:OperacionM expansion:( op:("+" / "-") der:OperacionM {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return { tipo, izq: operacionAnterior, der}
    },
    izq
  )
}   

OperacionM = izq:UnariOp expansion:( op:("!" / "-") der:UnariOp {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return { tipo, izq: operacionAnterior, der}
    },
    izq
  )
}   

UnariOp = izq:("!" / "-") exp:UnariOp
        / Numero

Numero = [0-9]+("."[0-9]+)?
        /"(" exp:Expresion ")"
        /"[" exp:Expresion "]"



