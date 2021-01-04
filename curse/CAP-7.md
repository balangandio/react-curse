# Cap 7 - Diving Deeper into Components & React Internals

# 002 A Better Project Structure
--> É uma boa prática isolar componentes responsáveis por renderizar conteúdo, `presentation components`, 
dos componentes responsáveis por gerenciar estado `container components`.

# 005 Class-based vs Functional Components
--> Componentes podem ser escritos de duas maneiras:
* `class-based components`: classes que extendem Component;
* `functional components`: funções que recebem props e retornam um código JSX para renderização.

--> Nas versões mais anteriores do React, componentes funcionais eram bem menos capazes que os implementados 
em classes. Mas com a introdução dos `reacts hooks`, a diferença diminuiu, todavia ainda existe.
* `class-based components` gerenciam estado com `setState()`, tem acesso às suas propriedades com `this`, 
e podem usar `lifecycles hooks`;
* `functional components` gerenciam estado com o hook `useState()`, tem acesso às suas propriedades com o 
parâmetro `props`, e não podem usar `lifecycles hooks`.

--> É entendido como boa prática, utilizar `functional components` quando possível, preferencialmente não 
gerenciando estado, o que se adequa a componentes de apresentação. E utilizar `class-based components` 
quando necessário gerenciar estado ou ter acesso aos `lifecycles hooks`, o que entendido como componentes 
container.

# 006 class Component Lifecycle Overview
--> Todo o processo de renderização de um componente é compreendido em algumas etapas entendidas no que é chamado 
de `Component Lifecycle`. Para algumas dessas etapas é possível responder a sua execução implementado determinadas 
funções em componentes `class-based`. Em sequência, estas são as principais etadas:
* `constructor(props)`: o objeto representando o componente é construído recebendo suas `props`. É adequado realizar 
aqui a inicialização do estado. Quando o construtor é sobrescrito, é necessário chamar `super(props)`;
* `getDerivedStateFromProps(props, state)`: utilizado em casos específicos quando as `props` do componente são
alteradas e o estado precisar ser também alterado de maneira a corresponder às alterações;
* `render()`: a renderização é solicitada;
* `child components render()`: componentes descendentes são renderizados;
* `componentDidMount()`: o componente foi renderizado. Solicitações de chamadas assíncronas, como acesso a APIs, 
são adequadas neste momento. E não é adequado alterar o estado por questões de performance.

# 007 Component Creation Lifecycle in Action
```javascript
class TitleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { title: props.text };

        console.log('1. constructor');
    }

    static getDerivedStateFromProps(props, state) {
        console.log('2. getDerivedStateFromProps');
        return state;
    }

    render() {
        console.log('3. render');
        //console.log('4. children lifecycle');
        return <h1>{this.state.title}</h1>;
    }

    componentDidMount() {
        console.log('5. componentDidMount');
    }
}
```
* `getDerivedStateFromProps()` precisa ser declarado como `static`, e deve retornar um `state`.

# 008 Component Update Lifecycle (for props Changes)
--> Também há um `lifecycle` pertinente ao processo de atualização de um componente, de maneira que o mesmo reflita 
às alterações ocorridas no estado ou das propriedades recebidas. Em sequência, estas são as principais etadas:
* `getDerivedStateFromProps(props, state)`: utilizado em casos específicos quando as `props` do componente são
alteradas e o estado precisar ser também alterado de maneira a corresponder às alterações;
* `shouldComponentUpdate(nextProps, nextState)`: permite tomar a decisão de prosseguir ou interromper a atualização 
do componente. Últil para realizar otimizações de performance;
* `render()`: a renderização é solicitada;
* `child components update`: componentes descendentes são atualizados;
* `getSnapshotBeforeUpdate(prevProps, prevState)`: executado logo antes do processo de manipulação do DOM com o 
intuito de preservar algum dado relevante entre as atualizações, como a posição do scroll por exemplo;
* `componentDidUpdate()`: o componente foi atualizado. Solicitações de chamadas assíncronas, como acesso a APIs, 
são adequadas neste momento. E não é adequado alterar o estado por questões de performance.

--> As etapas são representas em:
```javascript
class TitleComponent extends Component {
    static getDerivedStateFromProps(props, state) {
        console.log('1. getDerivedStateFromProps');
        return state;
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('2. shouldComponentUpdate');
        return true;
    }

    render() {
        console.log('3. render');
        //console.log('4. children lifecycle');
        return <h1>{this.state.title}</h1>;
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('5. getSnapshotBeforeUpdate');
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('6. componentDidUpdate');
    }
}
```
* `getSnapshotBeforeUpdate()` deve retornar um objeto representando um snapshot, que posteriormente é passado 
para `componentDidUpdate()`.

# 010 Using useEffect() in Functional Components
--> `useEffect()` é um hook que permite `functional components` responderem aos eventos de renderização/atualização. 
É recebido como parâmetro uma função que é executada em momentos equivalentes a `componentDidMount()` e `componentDidUpdate()` 
em componentes baseados em classe.
```javascript
import React, { useEffect } from 'react';

const person = (props) => {
    useEffect(() => {
        console.log('something happens');
    });

    return <div><p>Name: {props.name}</p></div>;
};
```

# 011 Controlling the useEffect() Behavior
--> `useEffect()` recebe um array como segundo parâmetro que permite especificar em quais propriedades de `props`, 
alterações devem acionar a função. Quando o array não especifica nenhum propriedade, um array vazio, a função é 
acionada apenas na renderização inicial do componente:
```javascript
import React, { useEffect } from 'react';

const person = (props) => {
    useEffect(() => console.log('something happens'));
    useEffect(() => console.log('first render happens'), []);
    useEffect(() => console.log('something happens to [props.name]'), [props.name]);
    useEffect(() => console.log('something happens to [props.color] and/or [props.movie]'), [props.color, props.movie]);

    return <div><p>Name: {props.name}</p></div>;
};
```
* Podem ser registradas mais de uma função. E cada função pode ser associada a um determinado conjunto de propriedades 
de `props`.

# 012 Cleaning up with Lifecycle Hooks & useEffect()
--> É possível responder ao momento logo anterior ao processo de remoção de um componente do DOM através do método 
`componentWillUnmount()`. Este é momento apropriado para realizar limpeza e liberação de recursos.
```javascript
class TitleComponent extends Component {
    render() {
        return <h1>{this.props.title}</h1>;
    }

    componentWillUnmount() {
        console.log('do the clean');
    }
}
```

--> Para `functional components`, é possível atingir o mesmo comportamento utilizando o retorno da função registrada com 
`userEffect()`, atentando ao segundo parâmetro `[]`, um array vazio:
```javascript
import React, { useEffect } from 'react';

const person = (props) => {
    const cleanUpCallback = () => {
        console.log('do the clean');
    };

    useEffect(() => {
        console.log('first render happens');
        return cleanUpCallback;
    }, []);

    return <div><p>Name: {props.name}</p></div>;
};
```
* Quando o segundo parâmetro de `useEffect()` é um array vazio, o callback retornado é executado quando o componente é 
desmontado.
* Quando o segundo parâmetro não é especificado, o callback é executado logo antes do próximo ciclo de atualização.
* Caso seja especificado como segundo parâmetro alguma propriedade de `props`, o callback é executado logo antes do próximo 
ciclo de atualização daquela propriedade.

# 014 Using shouldComponentUpdate for Optimization
--> Quando um componente recebe alguma atualização e sua renderização é solicitada com a executação de `render()`, toda a 
estrutura de componetes descendentes também sofre o mesmo. Todavia na prática, somente o que efetivamente sofreu alterações 
na sua representação é de fato renderizado no DOM, pois React mantém um DOM virtual que o permite fazer esta otimização.

--> Ainda sim, é interessante aprimorar esta otimização evitando que a renderização seja solicitada desnecessariamente em 
componentes descendentes com o uso do método `shouldComponentUpdate()`:
```javascript
class Persons extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.list !== nextProps.list;
    }

    render() {
        return this.props.list.map((p, i) => (
            <Person name={p.name} age={p.age} year={p.year} />
        ));
    }
}
```
* Permite que uma renderização prossiga somente se a propriedade `props.list` for diferente da atual;
* Todavia só é funcional se a imutabilidade de estado for adotada de maneira que referências sejam descartadas:
```javascript
class Container extends Component {
    addToListHandler = (newOne) => {
        this.setState({ list: [ ...this.state.list, newOne ]  });
    }

    render() {
        return <Persons list={this.state.list} />;
    }
}
```

# 015 Optimizing Functional Components with React.memo()
--> Evitar que renderizações prossigam com `shouldComponentUpdate()` só é possível em componentes baseados em classes. 
Todavia React oferece uma funcionalidade que permite atingir um comportamento semelhante em componentes funcionais. 
Quando um componente funcional é envelopado com a função `React.memo()`, solicitações de renderização só prosseguem 
se alguma propriedade de `props` for alterada. Caso contrário, a rederização é evitada e é devolvido apenas um snapshop 
do componente.
```javascript
import React from 'react';

const coloredTitle = (props) => {
    const styleProps = { color: props.color };

    return <h1 style={styleProps}>{props.children}</h1>;
};

export default React.memo(coloredTitle);
```

# 016 When should you optimize
--> A princípio pode parece interessante implementar `shouldComponentUpdate()` ou usar `React.memo()` em todos os locais 
possíveis na aplicação para incrementar performance. Todavia, para boa parte dos componentes, quando o parent sofre alguma 
atualização o mesmo precisa ser também renderizado. O que torna o código adicional em `shouldComponentUpdate()` e `React.memo()` 
desnecessário e impactante na performance. Por isso a inclusão destas otimizações devem ser avaliada adequadamente para 
cada situação.

# 017 PureComponents instead of shouldComponentUpdate
--> Quando queremos evitar que renderizações prossigam quando nenhuma propriedade de `props` sofre alteração, não é 
necessário implementar `shouldComponentUpdate()` e fazer as comparações se as referências mudaram. É possível atingir o 
mesmo comportamento bastando extender `PureComponent`:
```javascript
import React, { PureComponent } from 'react';

class Persons extends PureComponent {
    // No more necessary
    //shouldComponentUpdate(nextProps, nextState) {
    //    return this.props.list !== nextProps.list;
    //}

    render() {
        return this.props.list.map((p, i) => (
            <Person name={p.name} age={p.age} year={p.year} />
        ));
    }
}
```

# 018 How React Updates the DOM
--> React mantém uma representação virtual da estrutura do DOM apresentada no browser. Este virtual DOM é utilizado não só 
para confirmar a necessidade de renderização como também para precisar exatamente que parte de fato precisar ser alterada, 
evitando uma completa rederização de um componente.

--> Assim, mesmo que `shouldComponentUpdate()` não seja implementado para evitar uma rederização desnecessária, a mesma não 
alcançará o DOM. E mesmo que uma propriedade de uma componente como o texto ou o conjunto de classNames de um botão 
sejam alterados, o botão em si não é renderizado mas apenas o que de fato é alterado, no caso o innerText e o atributo class.

# 019 Rendering Adjacent JSX Elements
--> Código JSX como o retornado por `render()` precisa ter um único elemento root devido a maneira como as chamadas encadeadas 
a `React.createElement()` são construídas. Todavia, por vezes a inclusão de um elemento root como uma `<div>` pode limitar a 
maneira como o layout é construído.

--> Uma das maneiras de contornar este problema consiste em retornar um array de elementos:
```javascript
class Persons extends Component {
    render() {
        return [
            <button key="1">Do northing</button>,
            <ul key="2"><li>Some One</li><li>Other One</li></ul>,
            <p key="3">Legend of something</p>
        ];
    }
}
```
* Os elementos são separados vírgula e precisam do atribudo `key` para identificá-los unicamente no array.

--> Outra maneira de contornar o problema consiste em definir como elemento root um `higher order component`, um componente 
utilizado para incrementar demais, que neste caso não produz nenhuma estrutura no DOM e apenas retorna `props.children`:
```javascript
const root = props => props.children;

export default root;
```
* O uso:
```javascript
import Root from '../../hoc/Root';

class Persons extends Component {
    render() {
        return (
            <Root>
                <button key="1">Do northing</button>
                <ul key="2"><li>Some One</li><li>Other One</li></ul>
                <p key="3">Legend of something</p>
            </Root>
        );
    }
}
```

# 021 Using React.Fragment
--> React oferece um `higher order component` chamado `Fragment` para ser utilizado como elemento root sem introduzir elementos 
na renderização:
```javascript
import React, { Component, Fragment }  from 'react';

class Persons extends Component {
    render() {
        return (
            <Fragment>
                <button key="1">Do northing</button>
                <ul key="2"><li>Some One</li><li>Other One</li></ul>
                <p key="3">Legend of something</p>
            </Fragment>
        );
    }
}
```

# 022 Higher Order Components (HOC) - Introduction
--> Componentes `HOC` constituem uma maneira de introduzir elementos ou comportamentos na renderização, ou lógicas para trabamento 
de erros e requisições, em demais componentes sem que os mesmos precisam estar cientes do que está sendo feito. A implementação 
destes componentes usualmente utiliza `props.children` para expor a estrutura descendente.
```javascript
const borded = props => {
    const styles = {
        border: '2px solid red';
    };

    return <div style={styles}>{props.children}</div>
}

export default borded;
```

# 023 Another Form of HOCs
--> Uma outra maneira de declarar HOCs consiste em definir uma função que recebe o componente envolvido e parâmetros opcionais, 
e então retorna uma outra função que de fato representa a renderização do componente:
```javascript
import React from 'react';

const borded = (WrappedComponent, color) => {
    return props => {
        const styles = {
            border: `2px solid ${color}`;
        };

        return <div style={styles}><WrappedComponent {...props} /></div>
    }
};

export default borded;
```
* Não é feito uso de `props.children`, mas sim da referência do componente como parâmetro `WrappedComponent`;
* Para que o `WrappedComponent` tenha acesso a suas `props` é necessário encaminhar as mesmas, o que é feito utilizando com 
o spread operator do ES6 `{...props}`.

--> O uso de um HOC declarado desta maneira é feito na exportação do componente, e não em `render()`:
```javascript
import React, { Component, Fragment }  from 'react';
import borded from '../hoc/borded';

class Persons extends Component {
    render() {
        return (
            <Fragment>
                <button>Do northing</button>
                <ul><li>Some One</li><li>Other One</li></ul>
                <p>Legend of something</p>
            </Fragment>
        );
    }
}

export default borded(Persons, 'red');
```
* `borded(Persons, 'red')` retorna o componente `Persons` já envolvido pelo HOC.

--> Usualmente as duas maneiras de declarar HOCs são utilizadas para objetivos distintos:
* HOCs declarados como elementos são utilizados para introduzir elementos ou comportamentos na renderização;
* HOCs declarados como funções são utilizados para introduzir lógicas como tratamento de erros e requisições.

# 025 Setting State Correctly
--> Quando é passado para a função `setState()` um objeto representando o próximo estado, React não define imediatamente 
o state do componente e dá início ao ciclo de renderização. A tarefa é na verdade adicionada em uma fila para execução futura.

--> Este fato pode introduzir a comportamentos inesperados quando definimos o próximo state com base no atual. Pois caso 
duas chamadas a `setState` sejam suficientemente próximas, a tarefa da primeira chamada pode não ter sido concluída e a segunda 
chamada acaba tendo acesso a um estado inválido:
```javascript
class Counter extends Component {
    state = { counter: 0 };

    incrementHandler = () => {
        this.setState({ counter: this.state.counter + 1 });
    }

    render() {
        return <button onclick={incrementHandler}>Count - {this.state.counter}</button>;
    }
}
```
* Na há garantia que o contador sempre incremente a cada chamada a `incrementHandler()`. Duas solicitações de incrementos muito 
próximas poderia ter acesso ao mesmo valor de `counter`.

--> Todavia a função `setState()` oferece uma maneira alternativa para fazer atualizações do state que dependam do anterior. 
Ao contrário de passar um objeto como parâmetro, é passado uma função recebe o state anterior garantidamente:
```javascript
class Counter extends Component {
    state = { counter: 0 };

    incrementHandler = () => {
        this.setState((prevState, props) => {
            return { counter: prevState.counter };
        });
    }

    render() {
        return <button onclick={incrementHandler}>Count - {this.state.counter}</button>;
    }
}
```
* A função de atualização recebe o state anterior e o conjunto de props do componente, e deve retornar o objeto representando 
o próximo state.

# 026 Using PropTypes
--> React possui um pacote adicionado a parte chamado `prop-types`, que permite definir uma validação para os tipos de dados 
das propriedades `props`. O que é particulamente útil quando se está projetando um componente que potencialmente será utilizado 
por outras pessoas, e que não deixa de maneira clara em que formato valores devem ser passados.
* Install: `npm install --save prop-types`

--> O uso consiste em definir em uma propriedade estática chamada `propTypes` no componente, um objeto assinalando o tipo de 
dado esperado para as props:
```javascript
import React, { Component, Fragment }  from 'react';
import PropTypes  from 'prop-types';

class Persons extends Component {
    render() {
        return (
            <Fragment>
                <button onclick={this.props.change}>Change</button>
                <ul>
                    <li>{this.props.firstName}</li>
                    <li>{this.props.lastName}</li>
                </ul>
                <p>Next age: {this.props.age + 1}</p>
            </Fragment>
        );
    }
}

Persons.propTypes = {
    change: PropTypes.func,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    age: PropTypes.number
};

export default Persons;
```
* A importação `PropTypes` possui a definição de diferentes tipos de dados possíveis;
* Quando é passado um valor cujo tipo de dado não correspode ao esperado, uma mensagem de alerta é relatada no console do browser.

# 027 Using Refs
--> Muitas vezes precisamos ter uma referência a um elemento renderizado no DOM para realizar demais operações após o componente 
ser montado. React oferece um atributo especial chamado `ref` que permite capturar a referência:
```javascript
class Person extends Component {
    componentDidMount() {
        this.inputEl.focus();
    }

    render() {
        return (
            <Fragment>
                <p>{this.props.name}</p>
                <label>Change name: </label>
                <input type="text" ref={inputEl => this.inputEl = inputEl} />
            </Fragment>
        );
    }
}
```
* `ref` aceita uma função que recebe o elemento no DOM como referência;

--> Em versões mais recentes, `ref` pode receber um objeto especial criado com `React.createRef()`, que possui como objetivo 
manter a referência ao elemento:
```javascript
import React, { Component, Fragment }  from 'react';

class Person extends Component {
    constructor() {
        super();
        this.inputElRef = React.createRef();
    }

    componentDidMount() {
        this.inputElRef.current.focus();
    }

    render() {
        return (
            <Fragment>
                <p>{this.props.name}</p>
                <label>Change name: </label>
                <input type="text" ref={this.inputElRef} />
            </Fragment>
        );
    }
}
```
* O objeto responsável por manter a referência é criado no construtor.

# 028 Refs with React Hooks
--> Em componentes funcionais, não é possível utilizar `ref` para receber um callback ou um objeto `React.createRef()`. Contudo, 
é oferecido um hook chamado `useRef()` que permite atingir o mesmo objetivo:
```javascript
import React, { useRef, useEffect } from 'react';

const coloredTitle = (props) => {
    const btnRef = useRef(null);

    useEffect(() => btnRef.current.click(), []);

    return (
        <div>
            <h1>{props.children}</h1>
            <button ref={btnRef}>Change</button>
        </div>
    );
};
```
* Como a referência só acessível depois que o componente é montado, este momento pode ser interceptado com `useEffect(... , [])`.

# 029 Understanding Prop Chain Problems
--> Muitas vezes uma propriedade de um state é gerenciada em um componente hierarquicamente elevado, e componentes que precisam 
ter acesso a mesma se encontram muito abaixo. Para que o valor alcance os interessados, é necessário que seja encaminhando pelos 
componentes intermediários que muitas vezes não possuem interesse. Um status de autenticação é um exemplo de dado que acaba 
encontrando este problema.

# 030 Using the Context API
--> React oferece um recurso endereçado ao problema de encaminhamento de propriedades, chamado `Context API`. Um contexto consiste 
de um state que é criado a parte com `React.createContext()`:
```javascript
import React from 'react';

const authContext = React.createContext({
    authenticated: false,
    login: () => {}
});

export default authContext;
```
* A função recebe opcionalmente um valor default;

--> Com o contexto criado, um componente hierarquicamente elevado pode se encarregar de providenciá-lo para sua estrutura descendente:
```javascript
import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

class App extends Component {
    state = { hasLoggedIn: false };

    loginHandler = () => {
        this.setState({ hasLoggedIn: false });
    }

    render() {
        return (
            <AuthContext.Provider value={{
                    authenticated: this.state.hasLoggedIn,
                    login: loginHandler
                }}>
                <IntermediateComponent />
            </AuthContext.Provider>
        );
    }
}
```
* O contexto é providenciado utilizando o componente `Provider` disponível no objeto do contexto. E a propriedade `value` do `Provider` 
permite que o valor do contexto seja controlado.

--> Com o contexto providenciado, seu valor pode então ser consumido com o componente `Consumer` também disponível no objeto do contexto:
```javascript
import React from 'react';
import AuthContext from '../context/auth-context';

const header = props => {
    return (
        <header>
            <AuthContext.Consumer>
            {
                context => (
                    <p>You are {context.authenticated ? '' : 'not'} logged in.</p>
                    <button onclick={context.login} disabled={context.authenticated}>Login</button>
                )
            }
            </AuthContext.Consumer>
        </header>
    );
};

export default header;
```
* O contexto é consumido utilizando o componente `Consumer` que espera como children element uma função responsável por receber o state.

# 031 contextType & useContext()
--> React permite também que contextos sejam acessíveis fora do código JSX. Para isso é necessário apontar ao contexto desejado em um 
campo static chamado `contextType`. React se encarregará então de incluir componente uma referência ao contexto em `this.context`:
```javascript
import React, { Component, Fragment }  from 'react';
import AuthContext from '../context/auth-context';

class Person extends Component {
    static contextType = AuthContext;

    render() {
        const status = this.context.authenticated
            ? <span>Yes</span>
            : <span>No</span>

        return (
            <Fragment>
                <p>{this.props.name}</p>
                <label>Autenticated status: {status}</label>
            </Fragment>
        );
    }
}
```

--> Para componentes funcionais, contextos são acessíveis com o hook `useContext()`:
```javascript
import React from 'react';
import AuthContext from '../context/auth-context';

const header = props => {
    const authContext = useContext(AuthContext);

    return (
        <header>
            <p>You are {authContext.authenticated ? '' : 'not'} logged in.</p>
            <button onclick={authContext.login} disabled={authContext.authenticated}>Login</button>
        </header>
    );
};

export default header;
```