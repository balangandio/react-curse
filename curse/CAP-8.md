# Cap 8 - A Real App The Burger Builder (Basic Version)

# 003 Planning an App in React - Core Steps
--> Uma aplicação React pode ser planejada observando as seguintes perspectivas:
* Árvore/estrutura de componentes: interfaces podem ser desconstruídas em um árvore de componentes;
* Estado da aplicação: dados mutáveis podem ser identificados de maneira a delimitar o estado da aplicação;
* Components vs Containers: componentes podem ser especializados entre apresentação e controle do estado.

# 005 Planning the State
--> Quando estamos lidando com uma aplicação com múltiplos contextos, como quando há diferentes páginas, é 
interessante gerenciar o state de cada contexto no seu respectivo componente root, e não concentrar todo o 
estado da aplicação em um único componente central.

# 011 Adding Prop Type Validation
--> O pacote `PropTypes` permite definir a obrigatoriedade de um propriedade de props com `isRequired`:
```javascript
burgerIngredient.propTypes = {
    type: PropTypes.string.isRequired
};
```

# 028 Using a Logo in our Application
--> Arquivos de imagens podem ser "importados" no código javascript graças a um recurso oferecido pela 
ferramenta de bundle `webpack`. Na prática, quando o comando de importação é identificado no momento de 
geração do bundle, o arquivo referenciado é copiado para a pasta pública resultante, e o código javascript 
é ajustado para fazer referência a uma string contendo o path adequado:
```javascript
import burgerLogo from '../../assets/images/burger-logo.png';

const logo = props => (
    <div>
        <img src={burgerLogo} alt="Burger burger" />
    </div>
);
```

# 029 Adding Reusable Navigation Items
--> Propriedades passadas como atributo vazio são asimiladas como valor boleano `true`:
```javascript
const navigationItem = props => (
    <a href={props.link} className={props.active ? 'active' : null}>{props.children}</a>
);

//...

const navigationBar = props => {
    return (
        <nav>
            <NavigationItem link="/" active>Home</NavigationItem>
        </nav>
    );
};
```
* O atributo `active` equivaleria a `active={true}`

# 031 Working on Responsive Adjustments
--> Quando o recurso de módulos CSS é utilizado, diferentes componentes podem importar o mesmo arquivo CSS. 
No momento de execução, cada componente terá sua folha de estilo com classes com nomes distintos.