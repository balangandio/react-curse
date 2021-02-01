# Cap 16 - Redux Advanced

# 002 Adding Middleware
--> Redux permite que middlewares sejam posicionados entre o dispatch de ações e o tratamento pelo reducers. 
A função `applyMiddleware()` é utilizada para declarar as funções no momento de criação da store:
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';

const logger = store => {
    return next => {
        return action => {
            console.log(`--> dispatching [${action.type}]`);
            const result = next(action);
            console.log('--> next state: ', store.getState());

            return result;
        };
    };
};

const store = createStore(reducers, applyMiddleware(logger));
```
* Declaração de um middle de log de actions disparadas;
* A função `createStore()` recebe como segundo parâmetro a declaração de middlewares aplicada com `applyMiddleware()`, 
que por sua vez recebe um ou mais middlewares como parâmetros;
* Um middleware consiste de uma função que recebe a store e deve retornar outra função com o callback de continuação da 
execução. Essa por sua vez deve retornar uma função que trata o recebimento de uma action. A função de tratamento da 
action é responsável por chamar `next(action)` e retornar seu resultado.

# 003 Using the Redux Devtools
--> A extensão `Redux DevTools` para o browser Chrome permite inspecionar a store da aplicação nas ferramentas de 
desenvolvimento do navegador. É possível acompanhar o histórico de actions disparadas, o resultado das mesmas e restaurar 
a store para determinado state.

--> Após instalar a extensão no browser é necessário introduzir na criação da store uma espécie de middleware fornecido 
em tempo de execução:
```javascript
import { createStore, applyMiddleware, compose } from 'redux';

import logger from './my-logger-middleware';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(logger)));
```
* Redux oferece a função `compose()` que permite combinar múltiplos `enhancers` (como o fornecido por `applyMiddleware()`). 
E a mesma pode ser utilizada como fallback no caso da extensão não esteja disponível no browser.

# 005 Introducing Action Creators
--> Os objetos que representam actions podem ser criados em funções separadamente tornando o código mais organizado. 
Essas funções são comumente chamadas de `actions creators`.
* Declaração:
```javascript
export const STORE_CURRENT = 'STORE_CURRENT';

export const storeCurrent = (val) => {
    return {
        type: STORE_CURRENT,
        val
    };
};
```
* Uso:
```javascript
import * as actions from './store/actions';

const mapDispatchToProps = (dispatch) => {
    return {
        onStoreResult: (val) => dispatch(actions.storeCurrent(val))
    };
};
```

# 007 Handling Asynchronous Code
--> `Actions creators` são também um local apropriado para executar código assíncrono sem ainda adentrar no fluxo síncrono 
do Redux. O pacote `redux-thunk` oferece uma maneira de aproveitar isso.
* Install: `npm install --save redux-thunk`
* É configurado um middleware na criação da store:
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import myMiddleware from './my-middleware';

const store = createStore(reducers, applyMiddleware(myMiddleware, thunk));
```

--> Com o middleware adicionado, agora action creators podem retornar uma função que dispara ações no futuro:
```javascript
export const STORE_CURRENT = 'STORE_CURRENT';

export const storeCurrent = (val) => {
    return {
        type: STORE_CURRENT,
        val
    };
};

export const storeCurrentAssync = (val) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(storeCurrent(val));
        }, 2000);
    };
};
```
* O middleware thunk intercepta as actions que são funções, e envia como parâmetro um `dispatch` para realizar o disparado 
da action que de fato irá ser recebida pelos reducers.

# 008 Restructuring Actions
--> É possível exportar importações de outros arquivos com ES6:
```javascript
export {
    increment,
    decrement
} from './counter';
export {
    storeResult,
    deleteResult
} from './result';
```
* Isso permite organizar as actions em arquivos separados por funcionalidade e agrupar todas as exportações em um único 
arquivo `./store/actions/index`.

# 009 Where to Put Data Transforming Logic
--> Muitas vezes nos deparamos com a situação em que a lógica de tratamento de dados pode ser feita no `action creator` ou 
no `reducer`. Nessas situações é interessante distinguir até onde a lógica pode ser executada pelo creator e quando passa a 
ser uma responsabilidade do reducer. É importante não misturar os papeis de maneira a tornar o código mais rastreável.

# 010 Using Action Creators and Get State
--> A função retornada pelo `action creator` executada pelo middleware `thunk` recebe como segurando parâmetro uma maneira de 
acessar o state da store:
```javascript
export const storeCurrentAssync = (val) => {
    return (dispatch, getState) => {
        console.log(getState().results);

        setTimeout(() => dispatch(storeCurrent(val)), 2000);
    };
};
```
* É interessante evitar o acesso direto a store desnecessariamente quando o mesmo objetivo pode ser feito pelo cliente da 
chamada.