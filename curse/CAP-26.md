# Cap 26 - React Hooks

# 002 What are React Hooks
--> React hooks constitue um grupo de funcionaldades introduzidas com React 16.8 com o objetivo de expandir o trabalho com componentes funcionais.
* Permite trabalhar com lifecycles em componentes funcionais;
* Permite gerenciar side effects e estado;
* Permite compartilhar estado e lógica entre diferentes componentes funcionais;

--> Hooks são simples funções que usualmente possui a nomeclatura `use` no nome, e são executadas no contexto de componentes funcionais. 
O framework oferente já um conjunto de hooks utilitários, mas hooks customizados também podem ser criados.

# 004 Getting Started with useState()
--> `useState()` consiste de um dos principais hooks oferecido pelo framework. Ele permite trabalhar com um state que  sobrevive entre as 
chamadas de renderização do componente funcional.
```javascript
import React, { useState } from 'react';

const Form = () => {
    const [state, setState] = useState({ title: '', amount: '' });

    return (
        <div>
            <input type="text" id="title" value={state.title}
              onChange={event => setState({ ...state, title: event.target.value })} />
            <input type="number" id="amount" value={state.amount}
              onChange={event => setState({ ...state, amount: event.target.value })} />
        </div>
    );
};
```
* O hook inicializa o state com um valor ou objeto (ou null/undefined), e sempre retorna um array com dois elementos, o objeto/valor que 
representando o state e uma função que permite realizar a sua atualização.

# 005 More on useState() & State Updating
--> Caso o state de `useState()` seja um objeto, a função de atualização não realiza o merge do anterior com o novo preservando propriedades 
não indicadas, mas realiza o descarte do objeto anteior e utiliza o novo como o state mais recente.

--> A função de atualização de `useState()` não executa a atualização do state imediatamente à sua chamada. Isso pode levar a comportamentos 
inesperados quando lidamos com sucessivas atualizações em curto espaço de tempo, referenciado o estado anterior. Para isso, a função permite 
que seja a ela fornecido uma função que recebe o estado anterior e é executada após atualizações pendentes serem de fato realizadas:
```javascript
const Form = () => {
    const [state, setState] = useState({ title: '', amount: '' });

    const updateValue = newValue =>
        setState(prevState => ({
            ...prevState,
            title: newValue
        }));

    return (
        <input type="text" id="title" value={state.title}
            onChange={event => updateValue(event.target.value)} />
    );
};
```

# 007 Multiple States
--> Não há limitação para quantidade de states gerenciados por `useState()` que um componente funcional pode tere, e é recomendado que 
propriedades não correlatas sejam gerenciadas em diferentes states:
```javascript
const Form = () => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    return (
        <div>
            <input type="text" id="title" value={title}
              onChange={event => setTitle(event.target.value)} />
            <input type="number" id="amount" value={amount}
              onChange={event => setAmount(event.target.value)} />
        </div>
    );
};
```

# 008 Rules of Hooks
--> Hooks devem ser utilizados no contexto de componentes funcionais, ou em outros hooks que assim estejam sujeitos. Hooks não podem ser 
utilizados em um conexto interno no componente, como dentro de callbacks. E hooks como `useState()` não podem ser utilizados dentro de 
fluxos condicionais como `if`, e sim no contexto de execução principal do componente.

# 012 useEffect() & Loading Data
--> `useEffect()` permite alcançar comportamentos semelhantes a lifecycle methods tradicionais, o que é últil para trabalhar com side 
effects como carregamentos.
* Para obter um comportamento semelhante a `componentDidUpdate()`, basta passar uma função apenas:
```javascript
import React, { useEffect } from 'react';

const Form = () => {
    useEffect(() => {
        console.log('component updated');
    });

    return (
        <div></div>
    );
};
```
* Para obter um comportamento semelhante a `componentDidMount()`, basta passa além da função um array vazio:
```javascript
const Form = () => {
    useEffect(() => {
        console.log('after first render');
    }, []);

    return (
        <div></div>
    );
};
```

# 013 Understanding useEffect() Dependencies
--> É possível restringir a execução de `useEffect()` para quando alguma propriedade é alterada, ou pelos menos uma de um dado conjunto, 
fornecendo as mesmas em um array como segundo argumento:
```javascript
const Form = (props) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        console.log('title or props.name got changed');
    }, [title, props.name]);

    return (
        <div>
            <input type="text" id="title" value={title}
              onChange={event => setTitle(event.target.value)} />
            <input type="number" id="amount" value={amount}
              onChange={event => setAmount(event.target.value)} />
        </div>
    );
};
```
* A função fornecida é também executada após a primeira renderização.

# 015 What's useCallback()
--> `useCallback()` é um hook utilitário que permite realizar o caching de referência de funções entre os sucessivos ciclos de renderização 
do componente. Isso é especialmente útil quando passamos callbacks para demais componentes e, estes por sua vez, realizam side effects a 
cada mudança de suas props. Loop infinito é criado visto que o callback sempre é recriado a cada renderização.
```javascript
const Ingredients = () => {
    const filteredIngredientsHandler = useCallback((ingrs) => {
        setIngredients(ingrs);
    }, []);

    return (
        <div className="App">
            <Search onLoadIngredients={filteredIngredientsHandler} />
        </div>
    );
};
```
* Assim como useEffect, é informado como segundo parâmetro um array de dependências para o qual o callback deve ser atualizado na ocasião 
que uma das propriedades é alterada;
* No componente dependente da atualização do callback:
```javascript
import React, { useCallback } from 'react';

const Search = props => {
    const { onLoadIngredients } = props;
    const [enteredFilter, setEnteredFilter] = useState();

    useEffect(() => {
        props.onLoadIngredients([]);
    }, [enteredFilter, onLoadIngredients]);

    return (...);
};
```

# 016 Working with Refs & useRef()
--> `useRef()` permite manter referência a componentes entre as renderizações:
```javascript
import React, { useRef } from 'react';

const Search = props => {
    const inputRef = useRef();

    return (
        <input ref={inputRef} type="text" />
    );
};
```

# 017 Cleaning Up with useEffect()
--> A função passada a `useEffect()` pode retornar um callback. Quando o array de dependências informado é vazio, o callback retornado é 
executado quando o componente é desmontado. Com array de dependência diferente, o callback é executado logo antes da próxima execução da função.
```javascript
const Search = props => {
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    useEffect(async () => {
        const timer = setTimeout(() => {
            console.log(inputRef.current.value);
        }, 500);

        return () => clearTimeout(timer);
    }, [enteredFilter, inputRef]);

    return (
        <input ref={inputRef} type="text" value={enteredFilter}
            onChange={evt => setEnteredFilter(evt.target.value)} />
    );
};
```
* Responde a última alteração de valor da entrada no intervalo de  .5s, executando o clearTimeout do acionamento logo anterior.

# 019 Loading Errors & State Batching
--> Quando realizamos sucessivas atualizações de estado sem requisitar o estado anterior, não necessariamente cada chamada irá disparar 
um ciclo de renderização. React otimiza situações como esta agrupando as atualizações em um único ciclo de síncrono.
```javascript
const Search = props => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const clearError = () => {
        setIsLoading(false);
        setError(null);
    };

    return (...);
};
```

# 021 Understanding useReducer()
--> `useReducer()` consiste de uma maneira alternativa de gerenciar estado em relação a `useState()`. Ações são disparadas para que uma 
função reducer realize a modificação do state. É últil quando temos diferentes states que são usualmente alterados em conjunto, ou quando temos múltiplas formas de atualização para um único state:
```javascript
const ingredientsReducer = (current, action) => {
    switch(action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [ ...current, action.ingredient ];
        case 'DELETE':
            return current.filter(ing => ing.id !== action.id);
        default:
            throw new Error('Should not get threre!')
    }
};

const loadReducer = (current, action) => {
    switch(action.type) {
        case 'SEND':
            return { ...current, loading: true, error: null };
        case 'RESPONSE':
            return { ...current, loading: false };
        case 'ERROR':
            return { ...current, loading: false, error: action.error };
        default:
            throw new Error('Should not get threre!')
    }
};

const Search = props => {
    const [ ingredients, dispatch ] = useReducer(ingredientsReducer, []);
    const [ loadState, dispatchLoadState ] = useReducer(loadReducer, { error: null, loading: false });

    const addIngredient = ingr => {
        dispatch({ type: 'ADD', ingredient: ingr });
    };
    const removeIngredient = id => {
        dispatch({ type: 'DELETE', id });
    };
    const setIngredienst = ingrs => {
        dispatch({ type: 'SET', ingredients: ingrs });
    };

    return (...);
};
```
* `useReducer()` recebe a função reducer e o valor inicial do state;
* React realiza o ciclo de rendererização do componente quando o reducer retorna um state diferente do anterior.

# 023 Working with useContext()
--> `useContext()` permite componentes funcionais acessar contextos criados com `React.createContext()`.
* Contextos são implementados por um componente HOC:
```javascript
import React, { useState } from 'react';

export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const AuthContextProvider = props => {
    const [ isAuthenticated, setIsAuthenticated ] = useState(false);

    const loginHandler = () => {
        setIsAuthenticated(true);
    };

    return (
        <AuthContext.Provider
            value={{ login: loginHandler, isAuth: isAuthenticated }}>
            { props.children }
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
```
* Devem ser disponibilizados em um entry point na aplicação:
```javascript
import AuthContextProvider from './context/auth-context';

ReactDOM.render((
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
), document.getElementById('root'));
```
* Componentes funcionais tem acesso com useContext:
```javascript
import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import { AuthContext } from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);

  if (authContext.isAuth) {
    return <Ingredients />;
  }

  return (
    <button onClick={authContext.login()}>Login</button>
  );
};
```

# 024 Performance Optimizations with useMemo()
--> `useMemo()` permite memorizar valores que podem ter custo de processamento elevado:
```javascript
import React, { useMemo } from 'react';

const Search = props => {
    const ingredientsList = useMemo(() => {
        return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
    }, [ingredients, removeIngredientHandler]);

    return (
        <div>{ ingredientsList }</div>
    );
};
```
* Funciona de maneira semelhante a `React.memo()`, mas ao contrário de usar o objeto props como dependência, a função recebe um array de 
dependências pelas quais o valor será reprocessado.

# 025 Getting Started with Custom Hooks
--> Hooks customizados são apenas funções, usualmente nomeadas com `use`, que podem fazer uso de demais hooks para se encarregar de alguma 
lógica potencialmente últil para múltiplos componentes na aplicação.
* Um hook que realiza o controle de estado para requisições http pode ser:
```javascript
import { useReducer } from 'react';

const loadReducer = (current, action) => {
    switch(action.type) {
      case 'SEND':
        return { ...current, loading: true, error: null, data: null };
      case 'RESPONSE':
        return { ...current, loading: false, data: action.responseData };
      case 'ERROR':
        return { ...current, loading: false, error: action.error };
      default:
        throw new Error('Should not get threre!')
    }
};

const useHttp = () => {
    const [ loadState, dispatch ] = useReducer(loadReducer, { error: null, loading: false });

    const sendRequest = useCallback(async (url, method, body) => {
        dispatch({ type: 'SEND' });

        try {
            const response = await fetch(url, { method, body });

            const data = await response.json();

            dispatch({ type: 'RESPONSE', responseData: data });
        } catch(err) {
            dispatch({ type: 'ERROR', error: err.message });
        }
    }), [];

    return {
        isLoading: loadState.loading,
        data: loadState.data, 
        error: loadState.error,
        sendRequest
    };
};

export default useHttp;
```
* Não há restrição para o tipo de retorno do hook. E o contexto é isolado caso o mesmo hook seja utilizado em múltiplos componentes ao mesmo tempo;
* O uso é feito no contexto principal do componente:
```javascript
const Search = props => {
    const { sendRequest, ...loadState} = useHttp();

    return (
        <div>
            { loadState.isLoading && <p>Loading</p> }
            { loadState.error && <p>We got a problem: {loadState.error}</p> }

            { !loadState.isLoading && (
                <button onClick={() => sendRequest('/posts')}>Request<button>
            )}
        </div>
    );
};
```