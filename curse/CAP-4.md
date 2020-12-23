# Cap 4 - Working with Lists and Conditionals

# 002 Rendering Content Conditionally
--> Statements javascript podem ser escritos no código JSX envolvendo os mesmos em um bloco de chaves simples `{ ... }`.
Isso torna possível escrever condicionais para a rederização de parte do conteúdo, com a ajuda da operação ternária por exemplo.
```javascript
const person = (props) => {
    const [showAgeVisibility, setAgeVisibility] = useState(false);

    const toggle = () => {
        setAgeVisibility(!showAgeVisibility);
    };

    return (
        <div>
            <p>Name: {props.name}</p>
            {
                showAgeVisibility
                    ? <p>age: {props.age}</p>
                    : null
            }
            <button onClick={toggle}>Change it</button>
        </div>
    );
};
```
* Quando o statement resulta em `null`, nada é rederizado;
* Os statements dentro do JSX possuem limitações, com por exemplo não é possível escrever blocos como `if () { ... }`.

# 003 Handling Dynamic Content The JavaScript Way
--> Usualmente utilizamos a síntaxe JSX no retorno de `render()`, o que não é obrigatório. Código JSX pode ser atribuído a variáveis e 
posteriormente retornado, o que permite escrever blocos condicionais mais complexos por exemplo:
```javascript
const person = (props) => {
    const [showAgeVisibility, setAgeVisibility] = useState(false);

    const toggle = () => {
        setAgeVisibility(!showAgeVisibility);
    };

    let person = null;

    if (showAgeVisibility) {
        person = (<p>age: {props.age}</p>);
    }

    return (
        <div>
            <p>Name: {props.name}</p>
            { person }
            <button onClick={toggle}>Change it</button>
        </div>
    );
};
```

# 005 Outputting Lists
--> Quando um array de statements JSX é posto para ser renderizado, seus elementos são dispostos no DOM na 
mesma ordem que se dispõem no array. Isso torna possível renderizar resultados de iterações:
```javascript
class App extends Component {
    state = {
        persons: [
            { name: 'Human 1', age: 42 },
            { name: 'unknown', age: 23 },
            { name: 'loading', age: 54 }
        ]
    };

    render() {
        return (
            <div>
                { this.state.persons.map(person => ( <Person name={person.name} age={person.age} /> )) }
            </div>
        );
    }
}
```

# 007 Updating State Immutably
--> É uma boa prática manter os states de um componente imutável e, quando necessário alterá-lo, criar uma nova 
instância de maneira que não seja guardado referências ao anterior. A imutabilidade torna mais evidente os pontos  
onde o comportamento do componentes é alterado. Quando um elemento de um array precisar ser removido por exemplo, 
uma cópia do array sem o elemento pode ser instânciada:
```javascript
class App extends Component {
    state = {
        persons: [
            { name: 'Human 1', age: 42 },
            { name: 'unknown', age: 23 },
            { name: 'loading', age: 54 }
        ]
    };

    deleteHandler = () => {
        this.setState({ persons: this.state.filter(p => p.age % 2 == 0) })
    }

    render() {
        return (
            <div>
                { this.state.persons.map(person => ( <Person name={person.name} age={person.age} /> )) }
                <button onClick={this.deleteHandler}>Delete</button>
            </div>
        );
    }
}
```

# 008 Lists & Keys
--> Quando elementos de um array são renderizados, React lança no console do browser uma aviso sobre a inclusão 
do atributo `key`. Este atributo deve possuir um valor único entre os demais elementos do array. Internamente React 
utiliza o atributo para localizar o elemento no DOM, e verificar se houve alteração na sua estrutura em relação a um novo 
estado que precisa ser renderizado. Caso alterações não foram feitas, o elemento não precisar ser renderizado e o 
custo deste trabalho desonerado da performance.
```javascript
class App extends Component {
    state = {
        persons: [
            { name: 'Human 1', age: 42 },
            { name: 'unknown', age: 23 },
            { name: 'loading', age: 54 }
        ]
    };

    render() {
        return (
            <div>
                { this.state.persons.map((person, index) => ( <Person key={index} name={person.name} age={person.age} /> )) }
            </div>
        );
    }
}
```
* Utilização do index do elemento no array como atributo `key`.

# 009 Flexible Lists
--> Para alterar uma propriedade de um objeto de array no state de componente obedecendo o princípio da imutabilidade, 
é necessário novas instâncias para o objeto e para o array:
```javascript
class App extends Component {
    state = {
        persons: [
            { name: 'Human 1', age: 42 },
            { name: 'unknown', age: 23 },
            { name: 'loading', age: 54 }
        ]
    };

    changeNameHandler = (index) => {
        let person = this.state.persons[index];

        person = {
            ...person,
            name: person.name.chartAt(0) == person.name.chartAt(0).toUpperCase()
                ? person.name.toLowerCase()
                : person.name.toUpperCase()
        };

        const newPersons = this.state.persons.slice();
        newPersons[index] = person;

        this.setState({ persons: newPersons })
    }

    render() {
        return (
            <div>
                { this.state.persons.map((person, index) => (
                    <Person name={person.name} age={person.age} change={() => this.changeNameHandler(index)} />
                )) }
            </div>
        );
    }
}
```
* Uma outra maneira de copiar as propriedades de um objeto para um novo, consiste: `Object.assign({}, oldObject)`;