# Cap 20 - Testing

# 003 Required Testing Tools
--> Testes precisam simular casos de uso dos componentes e inspecionar a aplicação transversalmente verificando 
se o comportamento está dentro do esperado. Para isso existem ferramentas que auxiliam nesta tarefa.
* `Test Runner`: ferramentas que simula o ambiente de execução. `Jest` é uma ferramenta bastante utilizada com 
React já pré-disponível na aplicação;
* `Testing Utilities`: ferramentas que auxiliam na inspeção e escrita de asserções sobre o estado da aplicação. 
`React Test Utils` consiste um conjunto de utilitário e `Enzyme` consiste de uma ferramenta bastante popular para 
a mesma tarefa.

# 004 What To Test
--> Não é interessante testar:
* Third party libraries: bibliotecas de terceiros já passam por seus próprios processos de testes;
* Conexões complexas: eventos que afetam indiretamente diferentes partes da aplicação, como a alteração de um campo d
a store.

--> É interessante testar:
* Unidades isoladas: componentes e funções parametrizadas que possuem tarefas bem definidas;
* Saídas condicionais: renderizações dependentes de condições para ocorrerem.

# 005 Writing our First Test
--> Instalação da ferramenta Enzyme (react v17):
* `npm install --save enzyme react-test-renderer enzyme-adapter-react-17`

--> Testes são escritos em uma arquivo separado cujo nome obedece a notação: `<component>.test.js`
```javascript
import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationsItems from './NavigationItems';
import NavigationsItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

describe('<NavigationItems />', () => {
    it('should render two <NavigationItem /> elements if not authenticated', () => {
        const wrapper = shallow(<NavigationsItems />);
        expect(wrapper.find(NavigationsItem)).toHaveLength(2);
    });
});
```
* Realiza o teste se o componente `NavigationsItems` renderiza 2 instâncias do componente `NavigationsItem`;
* A função `configure()` especifica o adaptador para a versão do React utilizada;
* As funções `describe()`, `it()` e `expect()` são disponibilizadas no ambiente de execução pela ferramenta Enzyme;
* `describe()` agrupa com conjunto de asserções sobre algum alvo de teste; é informado um nome descritivo e a função 
que fará os testes;
* `it()` identifica uma asserção de teste; é informado uma descrição do que está sendo testado e a função que fará o 
teste;
* A função `shallow()` permite redenrizar componentes superficialmente, onde os componentes decentes são substituidos 
por placeholders;
* `shallow()` recebe o conteúdo JSX a ser renderizado, e retorna um wrapper com funções utilitárias que permitem inspecionar 
renderização;
* A função `expect()` permite fazer asserções sobre um conteúdo renderizado.

--> A execução dos testes pode ser iniciada com o atalho `npm test`, que é equivalente a execução do script no package.json 
`npm run test`:
```javascript
{
    "scripts": {
        "test": "react-scripts test --env=jsdom"
    }
}
```
* A execução listara o conjunto de `describe()` escritos e ao final um sumário do total de testes executados e sucedidos.

# 006 Testing Components Continued
--> A função `beforeEach()` permite execução algum código antes de cada verificação `it()`:
```javascript
describe('<NavigationItems />', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<NavigationsItems />);
    });

    it('deve renderizar <NavigationItem />{2} se não isAuthenticated', () => {
        expect(wrapper.find(NavigationsItem)).toHaveLength(2);
    });

    it('deve renderizar <NavigationItem />{3} se isAuthenticated', () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.find(NavigationsItem)).toHaveLength(3);
    });
});
```
* O wrapper do componente renderizado permite definir props com a função `setProps()`.

# 007 Jest and Enzyme Documentations
--> Na documentação do Jest pode ser consultado demais maneiras de descrever asserções. E na documentação do Enzyme 
pode ser consulta a API de inspecionamento dos componentes.
--> É possível verificar se um wrapper renderizou um conteúdo com ``contains()`:
```javascript
describe('<NavigationItems />', () => {
    let wrapper = null;

    beforeEach(() => {
        wrapper = shallow(<NavigationsItems />);
    });

    it('...', () => {
        wrapper.setProps({ isAuthenticated: true });
        expect(wrapper.contains(<NavigationsItem link="/logout">Logout</NavigationsItem>)).toEqual(true);
    });
});
```

# 009 Testing Containers
--> Componentes containers são testados da mesma maneira, e o estado pode ser modificado com `wrapper.setState()`. 
Caso o componente esteja conectado ao redux com `connect()`, a classe deve ser exportada para ser testada.

# 010 How to Test Redux
--> Como o código responsável por controlar o estado da aplicação no Redux, os reducers, são apenas funções puras sem 
estado, testes podem também serem feito para varificar se estão funcionando adequadamente:
```javascript
import reducer from './auth';

describe('auth reducer', () => {
    it('deve retornar o estado inicial', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        });
    });
});
```