# Cap 28 - Bonus Replacing Redux with React Hooks

# 003 Alternative Using the Context API
--> Uma das alternativas ao gerenciamento global de estado com redux, consiste em utilizar a Conext API.
* O context faz uso de `useState` para gerenciar o estado:
```javascript
import React, { useState } from 'react';

const ProductsContext = React.createContext({
    products: [],
    toggleFavorite: () => {}
});

export default props => {
    const [ productsList, setProductsList ] = useState([
        { id: 'p1', title: 'Red Scarf', isFavorite: false },
        { id: 'p2', title: 'T-Shirt', isFavorite: false }
    ]);

    const toggleFavorite = productId => { ... };

    return (
        <ProductsContext.Provider value={{
                products: productsList,
                toggleFavorite 
            }}>
            { props.children }
        </ProductsContext.Provider>
    )
};
```
* O context é providenciado para em um entry point da aplicação:
```javascript
import ProductsProvider from './context/products';

ReactDOM.render(
    <ProductsProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ProductsProvider>,
    document.getElementById('root')
);
```
* As propriedades do state e as actions são obtidas do context com `useContext()`:
```javascript
import React, { useContext } from 'react';
import { ProductsContext } from '../context/products';

const List = props => {
    const { products, toggleFavorite } = useContext(ProductsContext);

    return ( ... );
}
```

# 005 Context API Summary (and why NOT to use it instead of Redux)
--> O gerenciamento de estado pela Context API não é exatamente uma boa alternativa ao Redux pois seu mecanismo de atualização de componentes
 não é otimizado para compreender somente os componentes que efetivamente são afetados pelas mudanças. Context API é recomendado para estados 
 de baixa atualização, como temas e estado de autenticação.

# 010 Custom Hook Store Summary
--> É possível ainda implementar uma alternativa ao gerenciamento global com Redux puramente com React Hooks, tirando proveito de `useState()` e `useEffect()`:
```javascript
import { useState, useEffect } from 'react'; 

let globalState = {};
let listeners = [];
let actions = {};

export const useStore = (shouldListen = true) => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier, payload) => {
        const newState = actions[actionIdentifier](globalState, payload);

        globalState = { ...globalState, ...newState };

        for (let listener of listeners) {
            listener(globalState);
        }
    };

    useEffect(() => {
        if (shouldListen) {
            listeners.push(setState);
        }

        return () => {
            if (shouldListen) {
                listeners = listeners.filter(li => li !== setState);
            }
        };
    }, []);

    return [ globalState, dispatch ];
};

export const initStore = (userActions, initialState) => {
    if (initialState) {
        globalState = { ...globalState, initialState };
    }

    actions = { ...actions, ...userActions };
};
```
* A ideia consistem fazer com que os componentes que utilizam o custom hook compartilhem o mesmo estado `let globalState` utilizado no seu 
próprio `useState()`;
* Para cada componente, uma vez que a função de atualização do seu próprio `useState()` é registrado em `listeners.push(setState)`, podemos 
forçar a renderização dos componentes percorrendo o conjunto de listeners `listener(globalState)`;
* `shouldListen = true` permite que o componente opte por ter seu listener registrado para renderizações, últil no caso de otimizações;
* O hook retorna o estado global e a função de dispatch em `return [ globalState, dispatch ];`;
* A função `initStore()` permtite que configuremos o conjunto de ações da store assim como as propriedades iniciais do estado:
```javascript
import { initStore } from './store';

const productsInitalState = {
    products: []
};

export const configureProductsStore = () => {
    const actions = {
        TOGGLE_FAVORITE: (curState, productId) => {
            ...
            return { products: updatedProducts };
        }
    }
    initStore(actions, productsInitalState);
};
```
* A store é configurado em um entry point da aplicação:
```javascript
import App from './App';
import { configureProductsStore } from './hooks-store/products-store';

configureProductsStore();

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
```

--> O acesso ao estado e o dispatch de actions concentrado no hook:
```javascript
import { useStore } from '../hooks-store/store';

const Products = props => {
    const [ state, dispatch ] = useStore();
    const { products } = state;

    const toggleFavorite = () => {
        dispatch('TOGGLE_FAVORITE', products[0].id);
    };

    return (
        <p>Total of products: { products.length }</p>
        <button onClick={toggleFavorite}>Toggle favorite</button>
    );
}
```