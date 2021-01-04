# Cap 6 - Debugging React Apps

# 003 Finding Logical Errors by using Dev Tools & Sourcemaps
--> `Sourcemaps` são um recurso oferecido pela ferramenta de bundle do projeto, que permite que o código 
da aplicação possa ser inspecionado na ferramenta de debug do browser, ao mesmo tempo que o código de fato 
executado seja outro, proveniente do bundle.

# 004 - Working with the React Developer Tools
--> `React Developer Tools` é uma extensão para o browser Chrome que permite inspecionar os componentes da 
aplicação. É possível consultar/alterar o state/props dos componentes, assim como analisar a estrutura 
conteúdo DOM renderizado.

# 005 - Using Error Boundaries (React 16+)
--> `Error Boundaries` são uma maneira de gerenciar potenciais erros em componentes. Consiste de um componente 
que envolve outros demais propensos a produzirem exceções, com a particularidade de implementar o método 
`componentDidCatch()` responsável por tratar exceções lançadas na estrutura envolvida.
```javascript
import React, { Component } from 'react';

class ErrorBoundary extends Component {
    state = { hasError: false, errorMessage: '' };

    componentDidCatch = (error, info) => {
        this.setState({ hasError: true, errorMessage: error });
    }

    render() {
        this.state.hasError
            ? <h1>{this.state.errorMessage}</h1>
            : this.props.children;
    }
}

export default ErrorBoundary;
```
* Quando um error é capturado, `<h1>{this.state.errorMessage}</h1>` é renderizado;
* `this.props.children` corresponde ao componente envolvido que deve ser retornado na ausência de error.
* O uso do boundary poderia ser:
```javascript
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';

class App extends Component {
    state = {
        persons: [ { name: 'Human 1', age: 42 }, { name: 'unknown', age: 23 } ]
    };

    render() {
        return (
            <div>
                { this.state.persons.map((person, i) => (
                    <ErrorBoundary key={i}>
                        <Person name={person.name} age={person.age} />
                    </ErrorBoundary>
                )) }
            </div>
        );
    }
}
```

--> É uma boa prática utilizar error boundaries somente em regiões onde a ocorrência de exceções é esperada, e 
não envolver toda a aplicação de maneira que um error decorrente do processo de desenvolvimento bloqueie a mesma.