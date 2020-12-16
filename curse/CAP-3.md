# Cap 3 - Understanding the Base Features & Syntax

# 002 The Build Workflow
--> O uso de Reac e outros frameworks javascript, normalmente está atrelado a um conjunto de ferramentas 
de desenvolvimento necessárias para a construção da aplicação e uso de recursos avançados da linguagem.
* Gerenciamento de dependências com `npm`;
* Agrupamento do código da aplicação em bundles com `webpack`;
* Pre-processamento de javascript para retrocompatibilidade com `babel`;
* Servidor de desenvolvimento.

# 003 Using Create React App
--> O pacote `create-react-app` fornece um utilitário para criação instantânea de um projeto react.
* Install: `npm install -g create-react-app`
* Uso: `create-react-app react-curse`
* Start: `npm start`

# 004 Understanding the Folder Structure
--> O projeto React possui uma estrutura básica:
* O arquivo `package.json` que mantém a lista de dependências terá necessarimente `react`, `react-dom` e `react-scripts`;
* A pasta `public` corresponde a pasta pública disponibilizado pelo servidor web;
* O arquivo `src/index.js` corresponde ao ponto inicial da aplicação, com a chamada a `ReactDOM.render()`. 

# 005 Understanding Component Basics
--> O ponto de inicio da aplicação solicita a rederização de um componente que agrupará todos os demais Componentes:
```javascript
ReactDOM.render(<App />, root);
```

--> Componentes são classes que extendem `Component` e, necessariamente, devem implementar a função `render()`, responsável 
por retornar o código JSX que o representa no DOM.
```javascript
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello there!</h1>
      </div>
    );
  }
}

export default App;
```
* O código JSX é isolado entre `( )` e deve possuir um único elemento root que envolve todos os demais;
* A importação `import React from 'react';` é necessária.

# 006 Understanding JSX
--> O código JSX consiste de uma maneira mais intuitiva e legível de manipular o DOM. No processo de build da aplicação o 
código é compilado para um conjunto de chamadas encadeadas de `React.createElement()`:
```javascript
import React, { Component } from 'react';

class App extends Component {
  render() {
    return React.createElement(
        'div',
        { className: 'App' },
        React.createElement(
            'h1',
            null,
            'Hello there!'
        )
    );
  }
}

export default App;
```
* `React.createElement()` recebe os parâmetros: nome do elemento, conjunto de propriedades, um ou mais elementos contidos;
* A importação de `React` se deve ao uso da função `React.createElement()` no código compilado;

# 007 JSX Restrictions
--> Devido ao código JSX não ser extamente código HTML e estar envolvido com javascript, algumas restrições ocorrem:
* Nomes de propriedades são alteradas, como `className` se referindo a `class` para não causar conflito com a síntaxe javascript;
* Os elementos HTML na verdade são especificados pelo React, como `div`, `p`, `h1`, e não são de livre definição;
* O código deve possuir um element root que envolve todos os demais.

# 008 Creating a Functional Component
--> Um componente em resumo consiste de uma função que retorna um conteúdo JSX. E assim desta maneira, ele também pode ser declarado:
```javascript
import React from 'react';

const person = () => {
    return <p>This is a person</p>;
};

export default person;
```

# 011 Outputting Dynamic Content
--> Valores dinânimos podem ser introduzidos no código JSX envolvendo a síntaxe com `{ }`:
```javascript
const person = () => {
    return <p>This is a person with { Math.floor(Math.random() * 30) } years of age.</p>;
};
```

# 012 Working with Props
--> É possível passar parâmetros para um componente definindo atributos no seu elemento, e utilizando o objeto `props` para acessá-los:
* Defindo valores para os parâmetros:
```javascript
class App extends Component {
    render() {
        const personAge = 42;
        return <Person name="Person number 1" age={personAge} />;
    }
}
```
* Para passar o valor dinâmico, o mesmo não deve ser envolvido entre aspas `"`;
* Acessando valores no componente:
```javascript
const person = (props) => {
    return <p>This is {props.name} of age {props.age}</p>;
};
```

# 013 Understanding the children Prop
--> O objeto `props` recebe uma propriedade chamada `children` quando o componente é utilizado envolvendo algum conteúdo:
```javascript
class App extends Component {
  render() {
    return <Person name="Person number 2" age="-1">Hobbies: flying</Person>;
  }
}
```
* Acessando `props.children`:
```javascript
const person = (props) => {
    return (
        <div>
            <p>This is {props.name} of age {props.age}</p>
            <p>{props.children}</p>
        </div>
    );
};
```

# 014 Understanding & Using State
--> Componentes possuem uma propriedade especial chamdada `state`. Seu proprósito consiste de representar o estado do componente 
de maneira que quando é alterada, React força a execução de `render()` e consequentemente a atualização do DOM. Quando um componente 
que extende `Component` é declarado, é possível definir seu valor inicial no corpo da classe:
```javascript
class App extends Component {
    state = {
        first: {name="n1" age="42"},
        second: {name="n2" age="24"}
    };

    render() {
        return (
            <div>
                <Person name={this.state.first.name} age={this.state.first.age} />
                <Person name={this.state.second.name} age={this.state.second.age} />
            </div>
        );
    }
}
```

# 016 Handling Events with Methods
--> É possível definir eventos, como o atributo `onClick`, em elementos no código JSX:
```javascript
class App extends Component {
    clickHandler = () => {
        console.log('clicks all over the place');
    }

    render() {
        return (
            <div>
                <button onClick={this.clickHandler}>Click</button>
                <Person name="Person number 2" age="-1">Hobbies: flying</Person>
            </div>
        );
    }
}
```
* `onClick` recebe a referência a uma função;
* Em tempo de execução, a referência `this` dentro da função não se refere ao componente em que se encontra declarada. Todavia, é 
possível contornar esse detalhe declarando a função em formato `arrow function` como feito acima.

# 018 Manipulating the State
--> Classes que extendem `Component` possuem uma função especial chamada `setState()`. Seu proprósito consiste de não só alterar 
o objeto `state`, mas também disparar a renderização do DOM de maneira que o mesmo reflita ao novo estado do componente:
```javascript
class App extends Component {
    state = {
        name: 'human without a name',
        age: 1
    };

    clickHandler = () => {
        this.setState({ age: this.state.age + 1 });
    }

    render() {
        return (
            <div>
                <button onClick={this.clickHandler}>New Year</button>
                <Person name={this.state.name} age={this.state.age}></Person>
            </div>
        );
    }
}
```
* `setState()` recebe como parâmetro as novas alterações do estado, de maneira que as propriedades não especificadas (`name`) não
são removidas.

# 020 Using the useState() Hook for State Manipulation
--> Versões do React acima de `16.8` passaram a suportar a alteração de estado em componentes declarados como funções, graças a 
funcionalidades acrescentadas à plataforma chamadas de `React Hooks`. O hook utilizado para simular um estado é chamado `useState()`:
```javascript
import React, { useState } from 'react';

const person = (props) => {
    const [stateOfAge, setAge] = useState({ age: 42 });
    const [counter, setCounter] = useState(0);

    const clickHandler = () => {
        setAge({ age: stateOfAge.age + 1 });
        setCounter(counter + 1);
    };

    return (
        <div>
            <p>Name: {props.name}</p>
            <p>age: {state.age}</p>
            <button onClick={clickHandler}>Change it</button>
        </div>
    );
};

export default person;
```
* `useState()` recebe como parâmetro o estado inicial, e retorna em um array o objeto que representa o estado e uma função responsável por 
alterado;
* A função retornada para alteração de estado difere de setState em `Component`, pois ela recebe como parâmetro um estado complementamente 
novo, e não apenas as alterações.
* Podem ser criados quantos estados desejados com `useState()`, todos são isolados um do outro.

# 021 Stateless vs Stateful Components
--> Stateful components são componentes que gerenciam um estado.
* Seria uma classe extendendo `Component` e utilizando `setState()`, ou uma função utilizando utilizando `useState()`;
* É desejado ter poucos componentes gerais que mantêm o estado da aplicação, de maneira que o seu comportamento seja mais facilmente delimitado.

--> Stateless components são componentes que não gerenciam um estado.
* Usualmente se limitam a afetuar algum processamento sobre parâmetros de entrada e rederizam uma apresentação;
* É preferível ter o maior número possível de stateless components.

# 022 Passing Method References Between Components
--> O objeto `props` pode também receber referências, como funções:
```javascript
class App extends Component {

    confirmHandler = (name) => {
        console.log(`${name} has been confirmed`);
    }

    render() {
        const personName = "Human";
        const personAge = 42;
        return <Person name={personName} age={personAge} confirm={this.confirmHandler.bind(this, personName)} />;
    }
}
```
* `bind` permite obter uma referênia do acionamento da função em um objeto com determinados parâmetros;
* Uma outra maneira, todavia menos performática, seria utilizando arrow function: `confirm={() => this.confirmHandler(personName)}`
* Acessando valores no componente:
```javascript
const person = (props) => {
    return (
        <div>
            <p>This is {props.name} of age {props.age}</p>
            <button onClick={props.confirm}>Confirm</button>
        </div>
    );
};
```

# 023 Adding Two Way Binding
--> É possível fazer que um componente forneça seu próprio dado de entrada por meio de eventos:
```javascript
class App extends Component {

    state = { name: 'Human', age: 42 };

    changeNameHandler = (event) => {
        this.setState({ name: event.target.value });
    }

    render() {
        return <Person name={this.state.name} age={this.state.age} change={this.changeNameHandler} />;
    }
}
```
* No componente:
```javascript
const person = (props) => {
    return (
        <div>
            <p>This is {props.name} of age {props.age}</p>
            <input type="text" onChange={this.props.change} value={props.name} />
        </div>
    );
};
```

# 024 Adding Styling with Stylesheets
--> O estilo de componentes pode ser definido em um arquivo CSS e, graças a ferramenta `webpack`, pode ser importado no próprio 
componente como um módulo ES6. Na prática a importação apenas sinaliza que o arquivo deve ser incluído no contexto CSS:
* Definição de um arquivo `Person.css`
```css
.Person {
    width: 60%;
    border: 1px solid #ddd;
}
```
* Importação e uso:
```javascript
import React from 'react';
import './Person.css';

const person = (props) => {
    return (
        <div className="Person">
            <p>This is {props.name} of age {props.age}</p>
            <input type="text" onChange={this.props.change} value={props.name} />
        </div>
    );
};
```

# 025 Working with Inline Styles
--> O estilo de componentes também pode ser definido de uma maneira `inline` por meio do atributo `style`:
```javascript
const person = (props) => {
    const styleProps = {
        backgroundColor: 'red',
        padding: '8px'
    };

    return (
        <div style={styleProps}>
            <p>This is {props.name} of age {props.age}</p>
            <input type="text" onChange={this.props.change} value={props.name} />
        </div>
    );
};
```