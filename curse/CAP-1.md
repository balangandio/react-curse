# Cap 1 - Getting Started

# 002 What is React
--> React consiste de uma biblioteca javascript para construção de interfaces de usuário. É pensada para 
atender aplicações web tendo os navegadores como ambiente. E possui como uma das suas principais 
características a reutilização por componentes.

# 004 Real-World SPAs & React Web Apps
--> Componentes permitem organizar projetos dividindo responsabilidades e potencializando a reutilização, 
que por fim promovem aplicações mais fáceis de manter e incrementar.

# 005 Writing our First React Code
--> React utiliza alguns recursos javascript e a síntaxe JSX que não são interpretados pelo browser. A 
ferramenta `Babel` é então utilizada para realizar o pre-processamento e retrocompatibilidade do código.

--> Um simples app:
* Código javascript:
```javascript
function Person(props) {
  return (
    <div className="person">
      <h1>{props.name}</h1>
      <p>Age: {props.age}</p>
    </div>
  );
}

var app = (
  <div>
    <Person name="Human 1" age="42" />
    <Person name="Human 42" age="1" />
  </div>
);

ReadDOM.render(app, document.querySelector('#app'));
```
* Código HTML:
```html
<div id="app"></div>
```

# 006 Why Should we Choose React
--> A escolha pelo de React para construir aplicações pode ser amparada pelos benefícios:
* Simplificação do gerenciamento de estado de interfaces;
* Foco na lógica da aplicação e não na infraestrutura da interface;
* Amplo ecossistema e comunidade.

# 007 React Alternatives
--> Buscando os mesmos propósitos, existem plataformas alternativas a Read, como Angular e Vue.

# 008 Understanding Single Page Applications and Multi Page Applications
--> Single Page Applications são aplicações web representadas por uma única página html cujo conteúdo é 
totalmente gerenciado por javascript, e que na grande maioria implementam um mecanisco de rotas para 
identificar as diferentes telas da aplicação.
* Com React uma SPA usualmente apenas aciona `ReactDOM.render()` uma única vez.

--> Multi Page Applications são aplicações web que se distribuem em um conjunto de páginas, a princípio 
independentes, visitadas pelo usuário.
* O uso de React neste tipo de aplicação se destina a construção de widgets ou partes específicas dentro 
das páginas. `ReactDOM.render()` é então acionado para cada uma de maneira independente.