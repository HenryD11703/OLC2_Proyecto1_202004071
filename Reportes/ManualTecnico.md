# Manual Tecnico

## PeggyJs

El uso de peggy.js en este proyecto fue para generar el parser que analiza el codigo de OakLand, Peggy.js usa las gramaticas PEG, que son una forma analitica de generar gramaticas, es decir describir las reglas para un lenguaje

Las PEGs usan una eleccion ordenada que se basa en escoger la primera regla que coincida evitando asi la amgibuedad, tambien este tipo de parser puede utilizar un analisis de look-ahead infinito para tomar deciciones de analisis y Peggy.js tambien cuenta con un analisis lexico y sintactico

## Interprete

```javascript
Codigo = _ dcl:Declaracion* _ { return dcl }

Declaracion = dcl:Variable _ { return dcl }
            / matrix:Matrix _ { return matrix }
            / array:Array _ { return array }
            / func:FuncDcl _ { return func }
            / stmt:Statement _ { return stmt }
            / struct:Struct _ { return struct }
```

En este codigo es donde se inician las producciones de todo lo demas en la gramatica, se empieza con las declaraciones por la jerarquia que estas tienen

```javascript
Variable = _ tipo:("var") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('typeLessDcl', { id, valor:exp }) }
        /  _ tipo:("int" / "float" / "string" / "boolean" / "char" ) _ id:Identificador  _ "=" _ exp:Expresion _ ";"{ return crearNodo('declaracionVar', { tipo, id, valor:exp})}
        /  _ tipo:("int" / "float" / "string" / "boolean" / "char" ) _ id:Identificador _ ";"{ return crearNodo('simpleDcl', { tipo, id })} 
```
Como se puede observar a la hora de declarar variables se utilizan un nodo el cual acepta distintos valores, lo que hace con estos valores es interpretarlos para luego definir que hacer con eso en cada nodo

```javascript
  visitDeclaracionVariable(node) {
    const tipo = node.tipo;
    const nombre = node.id;
    const valor = node.valor.accept(this);

    if (this.entornoActual.verificarVariableExisteEnEntornoActual(nombre)) {
      this.consola += `Error: variable ${nombre} ya declarada\n`;
      this.errores.agregarError(`Error: variable ${nombre} ya declarada`, node.location.start.line, node.location.start.column, "Semantico");
      return;
    }

    if (tipo === "float" && valor.tipo === "int") {
      this.entornoActual.agregarVariable(nombre, tipo, parseFloat(valor.valor));
    } else if (tipo !== valor.tipo) {
      this.consola += `Error de tipos: no se puede asignar ${valor.tipo} a ${tipo}\n`;
      this.errores.agregarError(`Error de tipos: no se puede asignar ${valor.tipo} a ${tipo}`, node.location.start.line, node.location.start.column, "Semantico");
      this.entornoActual.agregarVariable(nombre, null, null);
    } else {
      this.entornoActual.agregarVariable(nombre, tipo, valor.valor);
    }

    this.tablaSimbolos.agregarSimbolo(node.location.start.line, node.location.start.column, nombre, tipo, valor.valor);
  }
  ```

  Esta seria la parte en la que la variable se interpreta, se hacen las verificaciones semanticas necesarias y se agrega a la tabla de simbolos

```javascript
De igual manera con las funciones, ya que basicamente es hacer un objeto que acepte el nodo y utilizar el nodo y sus valores para dar las funciones necesarias

SwtchStmt = "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ cases:Case* _ defaultC:Default? _ "}" 
    { return crearNodo('switch', { exp, cases, def:defaultC }) }

Case = "case" _ valor:Expresion _ ":" _ stmts:Declaracion* 
    { return { valor, stmts } }

Default = "default" _ ":" _ stmts:Declaracion* 
    { return { stmts } }

ForStmt = "for" _ "(" _ init:InitFor _  _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Statement { return crearNodo('for', { inicial:init, condicion:cond, incremento:inc, bloque:stmt }) }
        / "for" _ "(" _ tipo:("int" / "float" / "string" / "boolean" / "char" / "var" ) _ id:Identificador _ ":" _ exp:Expresion _ ")" _ stmt:Statement { return crearNodo('foreach', { tipo, id, exp, bloque:stmt }) }

InitFor = dcl:Variable { return dcl }
        / exp:Expresion ";" { return exp }
        / ";" { return null }

WhileStmt = "while" _ "(" _ cond:Expresion _ ")" _ stmt:Statement { return crearNodo('while', { condicion:cond, bloque:stmt }) }

IFStmt = "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Statement stmtFalse:( _ "else" _ stmtFalse:Statement { return stmtFalse } )? { return crearNodo('if', { condicion:cond, bloqueTrue:stmtTrue, bloqueFalse:stmtFalse }) }
```
En estas funciones se estan creando los nodos necesarios y se interpretan de esta manera

```javascript
  visitSwitch(node) {
    const switchValue = node.exp.accept(this);
    if (switchValue.tipo === null) {
      this.consola += `Error: expression en switch no puede ser null\n`;
      this.errores.agregarError("Error: expression en switch no puede ser null", node.location.start.line, node.location.start.column, "Semantico");
      return;
    }
    let matched = false;
    let executeNext = false;
    for (const caseNode of node.cases) {
      if (!matched && !executeNext) {
        const caseValue = caseNode.valor.accept(this);
        if (caseValue.tipo === null) {
          this.consola += `Error: Invalid case expression\n`;
          this.errores.agregarError("Error: Invalid case expression", node.location.start.line, node.location.start.column, "Semantico");
          continue;
        }
        if (switchValue.valor === caseValue.valor) {
          matched = true;
          executeNext = true;
        }
      }

      if (executeNext) {
        for (const stmt of caseNode.stmts) {
          try {
            stmt.accept(this);
          } catch (e) {
            if (e instanceof BreakException) {
              return;
            }
            throw e;
          }
        }
        if (caseNode.stmts.some((stmt) => stmt instanceof nodos.Break)) {
          return;
        }
      }
    }
    if (executeNext && node.def) {
      for (const stmt of node.def.stmts) {
        try {
          stmt.accept(this);
        } catch (e) {
          if (e instanceof BreakException) {
            return;
          }
          throw e;
        }
      }
    }
  }
```
La asociatividad en las operaciones se maneja junto a la jerarquia, creando sus producciones empezando por las que menos jerarquia tengan y terminando en las operaciones con mas jerarquia

```javascript
OperacionOr = izq:OperacionAnd expansion:( _ op:("||") _ der: OperacionAnd {return { tipo:op, der}})* {
  return expansion.reduce(
    (operacionAnterior, operacionActual) => {
      const { tipo, der } = operacionActual
      return crearNodo('binaria', { op:tipo, izq:operacionAnterior, der})
    },
    izq
  )
}
```

Para el uso de entornos se utilizo el siguiente codigo

```javascript
export class Entorno {
    constructor(padre = undefined) {
        this.variables = {};
        this.padre = padre;
    }

    asignarValorVariable(id, valor) {
        if (this.variables.hasOwnProperty(id)) {
            this.variables[id].valor = valor;
        } else if (this.padre) {
            this.padre.asignarValorVariable(id, valor);
        } else {
            throw new Error(`Error de referencia: variable ${id} no declarada`);
        }
    }
    agregarVariable(id, tipo, valor) {
        if (this.variables.hasOwnProperty(id)) {
            throw new Error(`Error: variable ${id} ya declarada en este ámbito`);
        }
        this.variables[id] = { tipo, valor };
    }
    obtenerValorVariable(id) {
        if (this.variables.hasOwnProperty(id)) {
            return { tipo: this.variables[id].tipo, valor: this.variables[id].valor };
        } else if (this.padre) {
            return this.padre.obtenerValorVariable(id);
        } else {
            return { tipo: null, valor: null };
        }
    }
    verificarVariableExiste(id) {
        return this.variables.hasOwnProperty(id) || (this.padre && this.padre.verificarVariableExiste(id));
    }
    verificarVariableTipo(id, tipo) {
        if (this.variables.hasOwnProperty(id)) {
            return this.variables[id].tipo === tipo;
        } else if (this.padre) {
            return this.padre.verificarVariableTipo(id, tipo);
        }
        return false;
    }
    verificarVariableExisteEnEntornoActual(id) {
        return this.variables.hasOwnProperty(id);
    }
    esEntornoGlobal() {
        return this.padre === undefined;
    }

}
```

Este codigo se encarga de generar variables en un entorno nuevo haciendo que la declaracion de variables no interfiera con otra variable ya creada en otro entorno, y que cuando una variable se busque en un entorno anidado si no la encuentra pueda buscar en los distintos entornos padre