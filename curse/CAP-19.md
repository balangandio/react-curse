# Cap 19 - Improving our Burger Project

# 005 Using Environment Variables
--> É interessante enviar que a aplicação seja inspecionada em produção caso esteja utilizando a extensão 
Redux Devtools. Para isso pode ser verificado se a aplicação está executando em um bundle em `development mode`:
```javascript
const composeEnhancers = process.env.NODE_ENV === 'development'
    ? (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose
    : compose;

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
```
* A variável global do Node chamada de `process` permite acessar as variáveis de ambiente que são especificadas 
pela ferramenta de bundle.

# 007 Adding Lazy Loading
--> Quando um componente é importado com a síntaxe `import ... from '...'` para ser especificado em uma rota, 
todo o seu código é introduzido no bundle mesmo que a rota correspondente ao mesmo nunca seja acessada. Uma maneira 
de torna o seu carregamento `lazy`, consiste em utilizar um HOC que só fará a sua importação caso o mesmo seja 
renderizado:
* O HOC consiste:
```javascript
import React, { Component } from 'react';

const asyncComponent = (importComponent) => {
    return class extends Component {
        state = { component: null };

        componentDidMount() {
            importComponent()
                .then(cmp => this.setState({ component: cmp.default }));
        }

        render() {
            const C = this.state.component;

            return C ? <C { ...this.props } /> : null;
        }
    }
};

export default asyncComponent;
```
* O uso consiste:
```javascript
const asyncCheckout = asyncComponent(() => {
    return import('./containers/Checkout/Checkout');
});

class App extends Component {
    render() {
        return (
            <Switch>
                <Route path="/checkout" component={asyncCheckout} />
            </Switch>
        );
    }
}
```
* Quando a rota se torna ativa, `componentDidMount()` do HOC é executado e a importação asíncrona com a função 
`import()` é realizada;
* A ferramenta de produção do bundle da aplicação identifica as importações asíncronas e produz `chunks` contendo 
o código importado que são solicitados pelo browser separadamente.