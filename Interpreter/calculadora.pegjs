
{
  const crearNodo = (tipoNodo, props) =>{
    const tipos = {
      'numero': nodos.Numero,
      'binaria': nodos.OperacionBinaria,
      'unaria': nodos.OperacionUnaria,
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

OperacionOr = izq:OperacionAnd expansion:( op:("||") der: OperacionAnd)*

OperacionAnd = izq:OperacionComparar expansion:( op:("&&") der:OperacionComparar)*

OperacionComparar = izq:OperacionRelacional expansion:( op:("==" / "!= ") der:OperacionRelacional)*

OperacionRelacional = izq:Operacion expansion:( op:("<" / "<=" / ">=" / ">") der:Operacion)*

Operacion = izq:OperacionM expansion:( op:("+" / "-") der:OperacionM)*

OperacionM = izq:UnariOp expansion:( op:("!" / "-") der:UnariOp)*

UnariOp = izq:("!" / "-") exp:UnariOp
        / Numero

Numero = [0-9]+("."[0-9]+)?
        /"(" exp:Expresion ")"
        /"[" exp:Expresion "]"



