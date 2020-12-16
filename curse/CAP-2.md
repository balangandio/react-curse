# Cap 2 - Refreshing Next Generation JavaScript (Optional)

# 004 Exports and Imports
--> Módulos no ES6:
* Arquivo principal:
```javascript
import { size0, fast10 } from './mod.js';
import size1 from './mod.js';
import * as all from './mod.js';
```
* Arquivo `mod.js`:
```javascript
export const size = 0;
export let fast = 9;

fast += 1;

export default {
  size: 1
};
```
* O objeto ou literal exportado com `default` não interfere com as exportações de constantes e variáveis;
* A importação agrupada em `all` consiste de todas as exportações por nomes e exportação default:
```javascript
{
  size: 0,
  fast: 10,
  default: { size: 1 }
}
```
* Importações por nome podem ser renomeadas com: `import {name as other} from 'file';`

# 005 Understanding Classes
--> Classes no ES6:
```javascript
class Animal {
  constructor() {
    this.serial = '123';
  }

  eat() {
    console.log('eat');
  }
}

class Bird extends Animal {
  constructor() {
    super();
    this.prop = 'asd';
  }

  fly() {
    console.log('fly');
  }
}
```
* A função `constructor` é executada no momento que um objeto é instanciado;
* Classes que extendem outras e declarem uma função `constructor`, devem necessariamente chamar `super()`.

# 006 Classes, Properties and Methods
--> ES7 trouxe uma síntaxe mais resumida para declarar propriedades e métodos em uma classe:
```javascript
class Animal {
  serial = '123';

  eat = () => {
    console.log('eat');
  }
}

class Bird extends Animal {
  serial = '321';
  prop = 'asd';

  fly = () => {
    console.log('fly');
  }
}
```
* A propriedade `serial` foi sobrescrita na classe `Bird`.

# 007 The Spread & Rest Operator
--> No ES6, é possível agrupar os argumentos de uma função em um array:
```javascript
function myFunc(...funcArgs) {
  console.log(`Total: ${funcArgs.length}`);
}
```

# 008 Destructuring
--> No ES6, é possível extrair valores expecíficos em arrays e objetos:
```javascript
const values = [1, 2, 3];
[num1, ,num3] = values;

const obj = { name: 'asd', size: 42};
const { name } = obj;
```
* Posições não desejadas em um array podem ser deixadas a parte com `, ,`.