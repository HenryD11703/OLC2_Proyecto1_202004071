
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'numero': nodos.Numero,
      'agrupacion': nodos.Agrupacion,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
      'declaracionVar': nodos.DeclaracionVariable,
      'accesoVar': nodos.ReferenciaVariable,
      'print': nodos.Print,
      'statement': nodos.Statement
    }

    const nodo = new tipos[tipoNodo](props);
    nodo.location = location();
    return nodo;
  }

    const _ = optional(() => {
    return repeat1(() => {
      return choice(
        () => CharacterSet.parse([ '\t', '\n', '\r', ' ']),
        () => Comment.parse()
      );
    });
  });

   options.whitespace = _;

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

Codigo = dcl:Declaracion* { return dcl }

Declaracion = vard:Variable { return vard }
          /   stmt:Statement { return stmt }

Variable = tipo:("int" / "float" / "string" / "boolean" / "char") id:Identificador "=" exp:Expresion ";"{
  return crearNodo('declaracionVar', { tipo, id, valor:exp})
}

Statement = "print(" exp:Expresion ")" ";"
          / exp:Expresion ";" { return crearNodo('statement', {exp})}

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = OperacionOr

OperacionOr = izq:OperacionAnd expansion:( op:("||") der: OperacionAnd {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}

OperacionAnd = izq:OperacionComparar expansion:( op:("&&") der:OperacionComparar {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionComparar = izq:OperacionRelacional expansion:( op:("==" / "!= ") der:OperacionRelacional {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionRelacional = izq:Operacion expansion:( op:("<" / "<=" / ">=" / ">") der:Operacion {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

Operacion = izq:OperacionM expansion:( op:("+" / "-") der:OperacionM {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionM = izq:UnariOp expansion:( op:("/" / "*") der:UnariOp {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

UnariOp = tipo:("!" / "-") exp:UnariOp { return crearNodo('unaria', { op:tipo, exp})}
        / Numero

Numero = [0-9]+("."[0-9]+)? { return crearNodo('numero', { valor: parseFloat(text(),10)}) }
        /"(" exp:Expresion ")" { return crearNodo('agrupacion', { exp }) }
        /"[" exp:Expresion "]" { return crearNodo('agrupacion', { exp }) }



