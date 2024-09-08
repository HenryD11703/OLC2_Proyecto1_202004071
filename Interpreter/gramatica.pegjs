
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
      'statement': nodos.Statement,
      'Cadena': nodos.Cadena,
      'nativo': nodos.Nativo
    }

    const nodo = new tipos[tipoNodo](props);
    nodo.location = location();
    return nodo;
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

Codigo = dcl:Declaracion* _ { return dcl }

Declaracion = dcl:Variable _ { return dcl }
          /   stmt:Statement _ { return stmt }
 
Variable =  _ tipo:("int" / "float" / "string" / "boolean" / "char") _ id:Identificador  _ "=" _ exp:Expresion _ ";"{
  return crearNodo('declaracionVar', { tipo, id, valor:exp})
}


// Statement = "System.out.println(" _ exp:Expresion ")" ";" { return crearNodo('print', {exp})}
Statement = "System.out.println(" _ args:ArgumentosPrint _ ")" _ ";" { return crearNodo('print', {args})}
          / exp:Expresion ";" { return crearNodo('statement', {exp})}

ArgumentosPrint = arg:Expresion args:("," _ exp:Expresion { return exp })* { return [arg, ...args] }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = OperacionOr


OperacionOr = izq:OperacionAnd expansion:( _ op:("||") _ der: OperacionAnd {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}

OperacionAnd = izq:OperacionComparar expansion:( _ op:("&&") _ der:OperacionComparar {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionComparar = izq:OperacionRelacional expansion:( _ op:("==" / "!= ") _ der:OperacionRelacional {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionRelacional = izq:Operacion expansion:( _ op:("<" / "<=" / ">=" / ">") _ der:Operacion {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

Operacion = izq:OperacionM expansion:( _ op:("+" / "-") _ der:OperacionM {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

OperacionM = izq:UnariOp  expansion:( _ op:("/" / "*" / "%") _ der:UnariOp {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   

UnariOp = tipo:("!" / "-") _ exp:UnariOp { return crearNodo('unaria', { op:tipo, exp})}
        / Nativo

//Se cambio de solo Numero a Nativo para manejar los tipos y hacer las verificaciones
//semanticas necesarias, para esto tambien sera necesario hacer la expresion de nativo 
//Que retorne el valor como tal para cuando se interprete la expresion de cada operacion
//se obtenga el valor y se pueda verificar el tipo


Nativo = [0-9]+ { return crearNodo('nativo', { tipo: 'int', valor: parseInt(text(), 10) }) }
        / [0-9]+ "." [0-9]+ { return crearNodo('nativo', { tipo: 'float', valor: parseFloat(text(), 10) }) }
        / "true" { return crearNodo('nativo', { tipo: 'boolean', valor: true }) }
        / "false" { return crearNodo('nativo', { tipo: 'boolean', valor: false }) }
        / '"' [^"]* '"' { return crearNodo('nativo', { tipo: 'string', valor: text() }) }
        / "'" . "'" { return crearNodo('nativo', { tipo: 'char', valor: text()[1] }) }
        /"(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
        /"[" _ exp:Expresion _ "]" { return crearNodo('agrupacion', { exp }) }
        / id:Identificador { return crearNodo('accesoVar', {id}) }

_ = [ \t\n\r]*


