# Cap 25 - Bonus A Brief Introduction to Redux Saga

# 001 Module Introduction
--> `Redux Saga` é um package que busca lidar com código assíncrono no contexto de aplicações redux, assim como `redux-thunk`.

# 002 Installing Redux Saga
--> Install: `npm install -s redux-saga`

# 003 Creating our First Saga
--> Usualmente é criada a pasta `store/sagas/` onde é depositado as funções responsáveis pela execução do código assíncrono. 
Esses funções são chamadas de `sagas` e são declaradas como generator functions.

--> `Generator functions` consiste de um recurso ES6 que permite executar funções pausadamente de maneira semelhante ao consumo 
de iteradores.
```javascript
function* my_generator_func(initial) {
    let next_val = yield initial + 1;
    yield next_val + ' world';
}

const generator = my_generator_func(1);

console.log('this is true:', generator.next().value === 2);
console.log('this is true:', generator.next('hello').value === 'hello world');
console.log('this is true:', generator.next().done === true);
```
* Generator functions são declaradas com o indicativo `*`, e podem usar a keywork `yield`;
* `my_generator_func(1)` não executa a função de imediado, apenas retorna um objeto `generator`;
* `generator.next(val)` recebe um valor que será retornado pela chamada `yield` atualmente em posição. É necessário uma chamada 
inicial de next para dar início a execução da função e para posicionar o cursor interno na primeira chamada `yield` presente;
* `{ value: <value>, done: <true/false> }` consiste do retorno de `generator.next`, sendo `value` o valor informado a `yield` 
no qual a execução parou, e `done` o indicativo de encerramento da função.

--> As funções saga são usam a função `put` para disparar a action que promoverá a atualização da redux store:
```javascript
import { put } from 'redux-saga/effects';

function* logoutSaga(action) {
    yield put({
        type: 'AUTH_LOGOUT'
    });
}
```
* Como parâmetro, é recebido o objeto action corresponte a action que levou a função saga a ser executada.

# 004 Hooking the Saga Up (to the Store and Actions)
--> O middleware capaz de lidar com as funções saga deve ser registrado na criação da store:
```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './store/reducers/index';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, composeEnhancers(
    applyMiddleware(sagaMiddleware)
));
```
* A função `createSagaMiddleware()` retorna o middleware que possui o runtime capaz de lidar as generator functions. Ele também 
pode ser utilizado para disparar funções saga diretamente:
```javascript
import { logoutSaga } from './store/sagas/auth';

sagaMiddleware.run(logoutSaga);
```

# 005 Moving Logic from the Action Creator to a Saga
--> Uma organização comum, consiste em fazer com que as funções saga sejam disparadas quando determinadas actions são acionadas. 
Isso é feito com auxílio de `takeEvery`:
```javascript
import { takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionsTypes';
import { logoutSaga } from './store/sagas/auth';

export function* watchAuth() {
    yield takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga);
}
```
* `takeEvery` recebe a action que será esperada, e a função saga que será executada toda vez que a mesma é disparada na store;
* Na criação da store pode ser feito o registro desta função intermediária com o `middleware.run()`:
```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './store/reducers/index';
import { watchAuth } from './store/sagas/index';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, composeEnhancers(
    applyMiddleware(sagaMiddleware)
));

sagaMiddleware.run(watchAuth);
```
* A função saga por sua vez realiza os devidos side effects e por último dispara a action que de fato irá atualizar a store:
```javascript
import { put } from 'redux-saga/effects';

import * as actions from '../actions';

function* logoutSaga(action) {
    yield localStorage.removeItem('token');
    yield put(actions.logoutSucceed());
}
```
* Como resultado, passam a existir duas actions. Uma que inicia o fluxo de logout com seus side effects, e outra usada apenas 
pela saga function que sinaliza o sucesso do fluxo:
```javascript
export const logout = () => {
    return {
        type: actionTypes.AUTH_INITIATE_LOGOUT
    };
};

export const logoutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};
```

# 006 Moving More Logic Into Sagas
--> É possível realizar reproduzir delays em funções saga semelhantes a setTimeout com auxílio de `delay`:
```javascript
import { put, delay } from 'redux-saga/effects';

import * as actions from '../actions';

export function* checkoutAuthTimeoutSaga(action) {
    yield delay(action.expirationTimeMilli);
    yield put(actions.logout());
}
```
# 007 Handling Authentication with a Saga
--> O runtime responsável por executar as funções saga possui como particularidade a resolução de promises passadas como retorno 
às chamadas `yield`:
```javascript
import { put } from 'redux-saga/effects';

import * as actions from '../actions';

export function* checkoutAuthTimeoutSaga(action) {
    let done;
    try {
        done = yield new Promise(res => 
            setTimeout(() => res('done'), action.expirationTimeMilli)
        );
    } catch(err) {
        console.log(err);
    }
    yield put(actions.logout());
}
```
* Erros são tratados por blocos try catch.

# 012 Diving Deeper into Sagas
--> Redux saga oferece algumas funções auxiliares que podem ser utilizadas nas generator functions.
* `call()` permite acionar que o runtime execute funções em objetos: 
```javascript
import { call } from 'redux-saga/effects';

export function* checkoutAuthTimeoutSaga(action) {
    //yield localStorage.removeItem('token');
    yield call([localStoragek, 'removeItem'], 'token');
}
```
* `all()` permite disparar um conjunto de chamadas `yield` concorrentemente, e esperar o encerramento de todo o conjunto:
```javascript
import { all } from 'redux-saga/effects';

export function* checkoutAuthTimeoutSaga(action) {
    yield all([
        new Promise(res => setTimeout(res('first'), 3000)),
        new Promise(res => setTimeout(res('second'), 3000))
    ]);
}
```
* `takeLatest()` permite selecionar a última action, de um dado type, mais recentemente disparada seja processada, e não todas 
as instâncias como `takeEvery` faz:
```javascript
import { takeEvery, takeLatest } from 'redux-saga/effects';

export function* watchBurger() {
    //yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
    yield takeLatest(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}
```