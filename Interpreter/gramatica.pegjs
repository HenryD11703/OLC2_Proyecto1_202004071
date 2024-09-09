
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
      'nativo': nodos.Nativo,
      'simpleDcl': nodos.DeclaracionSimple,
      'typeLessDcl': nodos.DeclaracionSinTipo,
      'asignacion': nodos.Asignacion,
      'bloque': nodos.Bloque,
      'if': nodos.If,
      'ternario': nodos.Ternary,
      'while': nodos.While,
      'for': nodos.For
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

Codigo = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:Variable _ { return dcl }
          /   stmt:Statement _ { return stmt }

// Para declarar variables hay distintas maneras
// la normal de declarar con el tipo, el id y el valor
// donde solo se declara el tipo y el valor
// y donde no se da un tipo sino que solo el valor
Variable = _ tipo:("var") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('typeLessDcl', { id, valor:exp }) }
        /  _ tipo:("int" / "float" / "string" / "boolean" / "char") _ id:Identificador _ ";"{ return crearNodo('simpleDcl', { tipo, id })}
        /  _ tipo:("int" / "float" / "string" / "boolean" / "char") _ id:Identificador  _ "=" _ exp:Expresion _ ";"{ return crearNodo('declaracionVar', { tipo, id, valor:exp})}

// Statement = "System.out.println(" _ exp:Expresion ")" ";" { return crearNodo('print', {exp})}
Statement = "System.out.println(" _ args:ArgumentosPrint _ ")" _ ";" { return crearNodo('print', {args})}
          / Bloque:Bloque { return Bloque }
          / exp:Expresion ";" { return crearNodo('statement', {exp})}
          / ifStmt:IFStmt { return ifStmt }
          / whileStmt:WhileStmt { return whileStmt }
          / forStmt:ForStmt { return forStmt }

ForStmt = "for" _ "(" _ init:InitFor _  _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Statement { return crearNodo('for', { inicial:init, condicion:cond, incremento:inc, bloque:stmt }) }

InitFor = dcl:Variable { return dcl }
        / exp:Expresion ";" { return exp }
        / ";" { return null } // Para validar asi como en lenguajes como js donde no es necesario que se declare algo en el for

WhileStmt = "while" _ "(" _ cond:Expresion _ ")" _ stmt:Statement { return crearNodo('while', { condicion:cond, bloque:stmt }) }

// esta produccion cubre el if normal, el if else, el if else if else
IFStmt = "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Statement stmtFalse:( _ "else" _ stmtFalse:Statement { return stmtFalse } )? { return crearNodo('if', { condicion:cond, bloqueTrue:stmtTrue, bloqueFalse:stmtFalse }) }

Bloque = "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', {dcls}) }

ArgumentosPrint = arg:Expresion args:( _ "," _ exp:Expresion { return exp })* { return [arg, ...args] }

Identificador = [a-zA-Z_][a-zA-Z0-9_]* { return text() }

Expresion = Asignacion

Asignacion = id:Identificador _ op:("+=" / "-=" / "=") _ exp:Asignacion { 
  if (op === "+=") {
    return crearNodo('asignacion', { 
      id, 
      exp: crearNodo('binaria', { op: '+', izq: crearNodo('accesoVar', {id}), der: exp })
    })
  } else if (op === "-=") {
    return crearNodo('asignacion', { 
      id, 
      exp: crearNodo('binaria', { op: '-', izq: crearNodo('accesoVar', {id}), der: exp })
    })
  } else {
    return crearNodo('asignacion', { id, exp })
  }
}
          / TernaryOp

TernaryOp = cond:OperacionOr _ "?" _ expTrue:Expresion _ ":" _ expFalse:Expresion { return crearNodo('ternario', { condicion:cond, expTrue, expFalse }) }
          / OperacionOr


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

OperacionComparar = izq:OperacionRelacional expansion:( _ op:("!=" / "==") _ der:OperacionRelacional {return { tipo:op, der}})* {
  // Asociatividad de izq a der
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual // esto hace que de operacion actual obtengamos los valores de tipo y der
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}   
// Es importante que cuando se crean las ER o palabras reservadas se hagan en orden
// asi como >= tiene que ir antes que > para que no reconozca primero el > y haga ya su match con la expresion
OperacionRelacional = izq:Operacion expansion:( _ op:("<=" / ">=" / ">" / "<") _ der:Operacion {return { tipo:op, der}})* {
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


Nativo = [0-9]+ "." [0-9]+ { return crearNodo('nativo', { tipo: 'float', valor: parseFloat(text(), 10) }) }
        / [0-9]+ { return crearNodo('nativo', { tipo: 'int', valor: parseInt(text(), 10) }) }
        / "true" { return crearNodo('nativo', { tipo: 'boolean', valor: true }) }
        / "false" { return crearNodo('nativo', { tipo: 'boolean', valor: false }) }
        / "null" { return crearNodo('nativo', { tipo: 'null', valor: null }) }
        / '"' ([^"\\] / "\\" .)* '"' { return crearNodo('nativo', { tipo: 'string', valor: JSON.parse(text()) }) }
        / "'" . "'" { return crearNodo('nativo', { tipo: 'char', valor: text().charAt(1) }) }
        / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }
        / "[" _ exp:Expresion _ "]" { return crearNodo('agrupacion', { exp }) }
        / id:Identificador { return crearNodo('accesoVar', {id}) }

_ = ([ \t\n\r] / Comments)*

Comments = "//" (![\n] .)*
            / "/*" (!("*/") .)* "*/"

