# Cap 5 - Styling React Components & Elements

# 002 Outlining the Problem Set
--> Por padrão não há um isolamento de estilo, definições globais em arquivos CSS acabam afetando todos os componentes.
```css
button {
    background: red;
}
```

# 003 Setting Styles Dynamically
--> O atributo `style` recebe as definições de estilo CSS em um objeto. E se tratando de um objeto javascript, o estilo 
de componentes pode ser alterado entre as renderizações do mesmo:
```javascript
class App extends Component {
    state = { backgrounds: ['red', 'green', 'blue'], current: 0 };

    changeHandler = () => {
        this.state.backgrounds.length - 1 === this.state.current
            ? this.setState({ current: 0 })
            : this.setState({ current: this.state.current + 1 })
    }

    render() {
        const containerStyle = { background: this.state.backgrounds[this.state.current] };

        return (
            <div style={containerStyle}>
                <button onClick={this.changeHandler}>Delete</button>
            </div>
        );
    }
}
```

# 004 Setting Class Names Dynamically
--> O atributo `className` recebe o conjunto de classes CSS em uma string separadas por espaço, o que consiste de uma 
outra maneira de estilizar os componentes de maneira dinâmica:
```javascript
class App extends Component {
    state = { classes: ['first', 'second', 'third'], current: 0 };

    changeHandler = () => {
        this.state.classes.length - 1 === this.state.current
            ? this.setState({ current: 0 })
            : this.setState({ current: this.state.current + 1 })
    }

    render() {
        return (
            <div className={this.state.classes[this.state.current]}>
                <button onClick={this.changeHandler}>Delete</button>
            </div>
        );
    }
}
```
* Arquivo CSS
```css
.first { background: red; }
.second { background: green; }
.third { background: blue; }
```

# 005 Adding and Using Radium
--> `Radium` é um pacote bastante popular no React que permite trabalhar com funcionalidades do CSS como 
pseudo-seletores e media queries, no código javascript.
* Install: `npm install --save radium`

--> Para utilizar `Radium`, é necessário envolver o componente raiz, como `App.js`, em uma função de extensão:
```javascript
import Radium from 'radium';

class App extends Component {
    ...
}

export default Radium(App);
```

--> Seletores CSS podem ser definidos como uma propriedade no objeto do atributo `style` envolvendo o nome 
do mesmo entre aspas e com o caracter `:`:
```javascript
const person = (props) => {

    const containerStyle = {
        background: 'red',
        color: white,
        ':hover': {
            background: 'blue'
        }
    };

    return (
        <div style={containerStyle}>
            <p>Name: {props.name}</p>
        </div>
    );
};
```
* Define os estilos para o seletor `:hover`.

# 006 Using Radium for Media Queries
--> Para fazer uso de media queries com `Radium`, é necessário envolver o componente raiz com componente `StyleRoot`:
```javascript
import Radium, { StyleRoot } from 'radium';

class App extends Component {
    render() {
        return (
            <StyleRoot>
                <div className="App">
                    <h1>Hello there!</h1>
                </div>
            </StyleRoot>
        );
    }
}

export default Radium(App);
```

--> O uso é feito introduzindo a definição do media query como uma propriedade do objeto do atributo `style`:
```javascript
const person = (props) => {

    const containerStyle = {
        background: 'red',
        color: white,
        '@media (max-width: 500px)': {
            width: '100%'
        }
    };

    return (
        <div style={containerStyle}>
            <p>Name: {props.name}</p>
        </div>
    );
};
```
* Define os estilos para o media query `(max-width: 500px)`.

# 007 Introducing Styled Components
--> `Styled-components` é um pacote que permite trabalhar de maneira mais eficiente com a estilização de componentes.
* Install: `npm install --save styled-components`

--> A utiliação é feita extendendo componentes internos da biblioteca já com os estilos pré-definidos, utilizando uma 
síntaxe especial introduzida no javascript chamada `template literals`:
```javascript
import styled from 'styled-components';

const StyledDiv = styled.div`
    background: red;
    color: white;

    &:hover {
        background: blue;
    }

    @media (max-width: 500px) {
        width: 100%;
    }
`;

const person = (props) => {
    return (
        <StyledDiv>
            <p>Name: {props.name}</p>
        </StyledDiv>
    );
};
```
* Um elemento `div` é extendido já com estilos em um componente `<StyledDiv>`;
* Os elementos HTML são implementados como componentes por funções acessíveis em `styled.<html element>`;
* Uma `template string` podem ser passada como argumento para uma função sem a utilização de parênteses;
* As propriedades CSS são definidas da mesma maneira que em um arquivo CSS;
* Pseudo-seletores são definidos com a notação `&:<seletor>`.

# 008 More on Styled Components
--> Na prática, `styled-components` injeta no cabeçario as definições de estilo em uma tag `<style></style>` por meio de 
classes CSS. E nos elementos HTML estilizados, estas classes são anexadas no atributo `class`. 

# 009 Styled Components & Dynamic Styles
--> `styled-components` permite trabalhar de maneira dinâmica com os estilos utilizando a notação de `template literals` 
do javascript para introduzir funções que recebem atributos definidos no componente:
```javascript
import styled from 'styled-components';

const StyledDiv = styled.div`
    background: ${props => props.alt.containerColor};
    color: white;
`;

class App extends Component {
    state = { backgrounds: ['red', 'green', 'blue'], current: 0 };

    changeHandler = () => {
        this.state.backgrounds.length - 1 === this.state.current
            ? this.setState({ current: 0 })
            : this.setState({ current: this.state.current + 1 })
    }

    render() {
        const params = {
            containerColor: this.state.backgrounds[this.state.current];
        };

        return (
            <StyledDiv alt={params}>
                <button onClick={this.changeHandler}>Delete</button>
            </StyledDiv>
        );
    }
}
```
* A função `${props => props.alt.containerColor}` possui acesso com o parâmetro `props` aos atributos definidos no 
componente, como feito com `alt={params}`.

# 010 Working with CSS Modules
--> Apesar da estilização de componentes por meio da definição de estilos no código javascript permite trabalhar de maneira 
mais dinâmica, não é uma solução interessante quando lidamos com uma grande quantidade de estilos.

--> A maneira padrão de definição de estilos nos arquivos CSS já é bastante satisfatória, todavia sofre a limitação que os 
seletores se aplicam para todos os componentes na aplicação, não havendo isolamento entre os arquivos de cada componente. 

--> Contudo, existe uma maneira de contornar este problema por meio de incrementos na ferramenta `webpack` utilizada 
internamente pelo React, pela funcionalidade `CSS Modules`. Essa tarefa consiste de definir uma síntaxe de identificação 
única que os arquivos CSS dos componentes terão no bundle gerado.
* Primeiro, é necessário expor o arquivo de configuração do `webpack` com o comando:
`npm run eject`
* Será gerado os arquivos `config/webpack.config.dev.js` e `config/webpack.config.prod.js`.
* Nos mesmos a configuração do `css-loader` deve ser localizada e alterada para tornar habilitado a funcionalidade de módulos 
CSS com as propriedades `modules` e `localIdentName`:
```javascript
{
    test: /\.css$/,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[name]__[local]__[hash:base64:5]'
            }
        },
        ...
    ]
}
```

--> A utilização de módulos CSS é feita importando os arquivos e atribuindo as classes lá definidas no atributo `className`:
```javascript
import classes from './Person.css';

const person = (props) => {
    return (
        <div className={classes.Container}>
            <p>Name: {props.name}</p>
        </div>
    );
};
```
* No arquivo `Person.css`:
```css
.Container {
    background: red
}
.Container p {
    color: blue;
}
```
* A referência a classe definida no arquivo CSS é feita acessando o objeto da importação, `classes.Container`;
* Na prática a classe CSS `Container` terá o nome alterado para uma identificação única, de maneira que não conflita com a 
mesma definida em outros arquivos CSS de outros componentes.

# 011 CSS Modules & Media Queries
--> Em versões mais recentes da biblioteca `react-scripts`, CSS Modules pode ser utilizados bastando definir os arquivos CSS 
com o notação no nome `<name>.module.css` assim como na importação.