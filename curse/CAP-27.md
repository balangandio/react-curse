# Cap 27 - Using Hooks in the Burger Builder

# 003 Routing with React.lazy()
--> React 16.6 introduziu a função `React.layz()` que permite realizar o carregamento lazy de componentes somente quando os mesmos foram 
solicitadas para exibição. É informado como parâmetro uma função que retorna a promise de carregamento do componente:
```javascript
import React, { Suspense } from 'react';

const Orders = React.lazy(() => {
    return import('./containers/Orders/Orders');
});

const App = props => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <Switch>
                <Route path="/orders" component={() => <Orders />} />
                <Route path="/" exact component={Home} />
            </Switch>
        </Suspense>
    );
};
```
* O componente `Suspense` permite especificar o conteúdo que será exibido enquanto quer o carregamento é feito;
* O componente indicado nas rotas lazy é especificado em arrow function `() => <Comp />`.

# 010 Using React.memo() & More!
--> `React.memo()` recebe como segundo parâmetro uma função que permite descrever a igualdade entre as props anteriores e as novas. O objetivo 
é o mesmo de `shouldComponentUpdate()`, todavia o retorno não representa a condição de atualização do componente, mas sim a igualdade entre as props:
```javascript
export default React.memo(
    Modal,
    (prevProps, nextProps) => 
        nextProps.show == prevProps.show && nextProps.children == prevProps.children
);
```

# 013 Working with useSelector() and useDispatch()
--> O pacote react-redux fornece o hook `useDispatch()` para que componentes funcionais possam disparar actions:
```javascript
import { useDispatch } from 'react-redux';

export const BurgerBuilder = props => {
    const onIngredientAdded = (ingName) => {
        dispatch(actions.addIngredient(ingName));
    };

    return (
        <button onClick={onIngredientAdded}>Add</button>
    );
};
```

--> O pacote `useSelector()` por sua vez permite que componentes funcionais possam acessar propriedades do state redux:
```javascript
import { useSelector } from 'react-redux';

export const BurgerBuilder = props => {
    const ingredients = useSelector(
        state => state.burger.ingredients
    );

    return (
        <List ingredients={ingredients} />
    );
};
```