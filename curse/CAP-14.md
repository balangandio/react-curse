# Cap 14 - Redux

# 001 Module Introduction
--> Redux consiste de uma biblioteca à parte na plataforma React, mas quase sempre atrelada a mesma, que 
ajuda no gerencialmente de estado da aplicação.

# 002 Understanding State
--> Em React, state consistem de uma informação mutável que determina o comportamento da aplicação. O status 
de open/close de um modal, mesmo que localmente relevante somente a um componente, consiste de um state. 
Assim como o status da atenticação do usuário, que potencialmente afeta comportamento global da aplicação, 
consiste também de um state.

# 003 The Complexity of Managing State
--> O gerenciamento de estado no React se torna mais complexo quando temos informações que precisam ser 
consultadas em locais distintos na aplicação, pois leva ao uso de query params em rotas e o cascateamento 
de passagem de props.

--> Como a aplicação é no final um bundle javascript, poderia ser utilizado uma objeto global acessível por 
qualquer componente. Todavia objetos globais externos aos componentes, ficam de fora do sistema reativo da 
plataforma, React não tem ciência das alterações efetuadas externamente, e a aplicação não reage às mudanças. 
E ainda mais, com diferentes partes manipulando diretamente objetos globais, tornamos o comportamento da 
aplicação mais imprevisível e menos rastreável.

# 004 Understanding the Redux Flow
--> O fluxo de funcionamento do Redux opera em volta de um único state global na aplicação. A ideia é que 
componentes solicitem que operações sejam feitas neste state e, após alterações terem sido feitas, Redux 
comunica a componentes interessados nas mudanças, disparando a renderização destes componentes, e promovendo 
a reação da aplicação:
* Componentes possuem a capacidade de disparar `actions` e de realizar a `subscription` para mudanças em 
determinadas partes do state global;
* Uma `action` consiste de um mensagem, opcionalmente com uma payload, que representa uma solicitação que 
uma operação seja feita;
* Operações que mutam o state da aplicação são chamadas de `reducers`, que consistem de funções puras que 
não devem disparar código assíncrono, mas sim apenas receber uma action e retornar a nova instância do state 
ao qual a mesma está encarregada de manipular;
* Assim que uma action é disparada, Redux encaminha a mesma para os reducers, e após ter as mudanças realizadas 
no state, comunica os componentes inscritos passando dados pelo objeto `props`.

# 005 Setting Up Reducer and Store
--> Redux é uma biblioteca muitas vezes atrelada a React, contudo a mesma pode ser utilizada em qualquer 
aplicação javascript, como com NodeJS.
* Install: `npm install --save redux`
```javascript
const redux = require('redux');

const initialState = { counter: 0 };

const incrementReducer = (state = initialState, action) => {
    return action.type == 'INCREMENT_COUNTER' ? { counter: state.counter + 1 } : state;
};

const store = redux.createStore(incrementReducer);

console.log(store.getState());
```
* States são criados com a função `createStore()` que recebe o conjunto de `reducers` que serão responsáveis 
por manipular os mesmos;
* O valor inicial do state pode ser definido com a atribuição de `default value` para o parâmetro `state` nos 
reducers;
* O estado de uma `store` pode ser obtido com a função `store.getState()`.

# 006 Dispatching Actions
--> `Actions` pode ser disparadas com `store.dispatch()`:
```javascript
store.dispatch({ type: 'INCREMENT_COUNTER' });
store.dispatch({ type: 'ADD_TO_COUNTER', value: 42 });
```
* A função recebe como parâmetro a representação da mensagem que será encaminhada para todos os reducers;
* Por convenção, definimos na propriedade de nome `type` uma descrição única da operação que pretendemos executar;
* Opcionalmente podem ser acrescentadas qualquer propriedade a mais de maneira a parametrizar a operção;
* Os `reducers` são responsáveis por verificar do que a action se trata, e operar o state adequadamente.

# 007 Adding Subscriptions
--> A inscrição para mudanças efetuados no state é feita com a função `store.subscribe()`:
```javascript
store.subscribe(() => {
    console.log('changes happens', store.getState());
});
```

# 008 Connecting React to Redux
--> A utilização de Redux com React é implementada pelo pacote `react-redux`:
* Install: `npm install --save react-redux`

--> É oferecido o componente `<Provider></Provider>` que permite envolver a aplicação e injetar a store que 
representará o state da aplicação. O que pode ser feito em um ponto inicial como em `index.js`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import reducer from './store/reducer.js';

const store = createStore(reducer);

const app = (
    <Provider store={store}>
        <App />
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
```
* O componente recebe a store pelo atributo `store`.

# 009 Connecting the Store to React
--> A interação dos componentes com a store é configurada com auxílio da função `connect()`. Com ela é definido 
quais propriedades do state será repaçada para o componente:
```javascript
import { connect } from 'react-redux';

class Counter extends Component {
    render() {
        return (<p>Counter: {this.props.ctr}</p>);
    }
}

const mapStateToProps = state => {
    return {
        ctr: state.counter
    };
};

export default connect(mapStateToProps)(Counter);
```
* É recebido como primeiro parâmetro uma função faz o mapeamento entre o state e o objeto `props` do componente, 
de maneira que o mesmo tenha acesso a propriedades do state;
* A função retorna um HOC que deve envolver o componente.

# 010 Dispatching Actions from within the Component
--> Com a função `connect()` também é definido quais `actions` estaram disponíveis para o componente disparar:
```javascript
import { connect } from 'react-redux';

class Counter extends Component {
    render() {
        return (<Button onClick={this.props.onIncrementCounter}>Counter {this.props.ctr}</Button>);
    }
}

const mapStateToProps = state => {
    return {
        ctr: state.counter
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onIncrementCounter: () => dispatch({ type: 'INCREMENT' })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```
* É recebido como segundo parâmetro uma função que faz o mapeamento entre o actions e o objeto `props` do 
componente, de maneira que o mesmo possa solicitar operações sobre state;
* A ação poderia ser parametrizada adicionando propriedades à action: `dispatch({ type: 'INCREMENT', data: 10 })`.

# 014 Updating State Immutably
--> Ao contrário de `this.setState()`, `reducers` sempre devem retornar a nova representação do state de maneira 
completa. E deve instanciar essa nova representação respeitando a imutabilidade de estado tando em objetos quanto 
em arrays:
```javascript
const initialState = { counter: 0, results: [] };

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, counter: state.counter + 1 };
        case 'DECREMENT':
            const newState = Object.assign({}, state);
            newState.counter -= 1;
            return newState;
        case 'STORE': 
            return { ...state, results: [ ...store.results, store.counter ] };
        default: state;
    }
};
```

# 017 Outsourcing Action Types
--> Caso seja disparado uma `action` identificada incorretamente, os reducers irão recebê-la mas não irão processá-la 
como esperado, sujeitando a aplicação a uma falha silenciosa. Uma maneira de cortar isso é identificar as actions com 
constantes em um arquivo separado:
* `actions.js`:
```javascript
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const ADD = 'ADD';
export const SUBTRACT = 'SUBTRACT ';
export const STORE_CURRENT = 'STORE_CURRENT';
export const DELETE = 'DELETE';
```
* Uso:
```javascript
import * as actions from '../../store/actions';
...
const mapDispatchToProps = dispatch => {
    return { onIncrementCounter: () => dispatch({ type: actions.INCREMENT }) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

# 018 Combining Multiple Reducers
--> Redux oferece a função `combineReducers()` que permite dividimos o gerenciamento do state em múltiplos `reducers` 
na aplicação. Cada reducer pode então gerenciar funcionalidades diferentes sem conflitar com propriedades de outra 
parte da aplicação:
```javascript
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import counterReducer from './store/reducers/counter.js';
import resultsReducer from './store/reducers/results.js';

const rootReducer = combineReducers({
    ctr: counterReducer,
    res: resultsReducer
});

const store = createStore(rootReducer);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
```

--> A função recebe como parâmetro um objeto mapeando como o state gerenciado por cada reducer será identificado na 
ligação com os componentes:
```javascript
const mapStateToProps = state => {
    return {
        counter: state.ctr.counter,
        results: state.res.results
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```
* O nome da propriedade definida no mapeamento com `combineReducers` é utilizado no mapeamento de state para props: 
`state.ctr.` e `state.res.`.

# 019 Understanding State Types
--> Nem todo estado precisa ser gerenciado com Redux, pois a complexidade implicada não se justifica em detrimento 
ao benefícil adquirido, ou o tipo de dado não é adequado.
* `Local UI state`: benefícil não muito tangível; toogle status de componentes visuais por exemplo;
* `Persistent state`: dados destinados a persistência; state se mantêm em memória e é perdido com a atualização da 
aplicação;
* `Client state`: adequado para ser gerenciado; potencialmente utilizado em múltiplas partes da aplicação.