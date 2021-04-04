# Cap 23 - Bonus Next.js

# 002 - Understanding Server Side Rendering
--> Soluções SPA por princípio deixam a cargo do cliente a responsabilidade por construir a estrutura 
e conteúdo da aplicação, a página `index.html` consiste de um entry point que dá início a todo o processo. 
Contudo esse comportamento enfrenta problemas em aplicações web que possuem SEO como requisito, pois motores 
de busca ignoram a lógica de renderização do cliente.

--> Server side rendering consiste de uma técnica em aplicações SPA que permite pré-renderizar a página web 
solicitada. E Next.js consiste de uma ferramenta de implementação de server-side rendering com React.

# 003 - Setting Up a Project
--> Setup:
* Install: `npm install --save next react react-dom`
* Adiconar scripts ao package.json:
```json
{
    "scripts": {
        "dev": "next",
        "build": "next build",
        "start": "next start"
    },
    ...
}
```

--> O funcionamento de Next.js impõe algumas restrições a maneira como o projeto é organizado. A principal 
delas é que as rotas e suas diferentes páginas são representadas pela disposição de arquivos em uma pasta 
chamada `pages`, e não mais são configuradas programaticamente. Next.js entenderá a estrutura de diretórios 
como as rotas da aplicação.
```
-> node_modules
-> pages/
---- index.js
---> auth/
------ index.js
-- package.json
```
* Os arquivos `.js` são componentes React que serão renderizados antes do conteúdo resultante ser enviado.
* Arquivos chamados `index.js` são servidos quando não é especificado um arquivo após o path.
* Ao executar o projeto com `npm run dev`, para o path `/auth` será servido o arquivo `./pages/auth/index.js`.

# 004 Understanding the Basics
--> Next.js possui componentes próprios utilizados para realizar navegação no seu mecanismo de rotas. Por as 
rotas da aplicação já são carregadas de maneira lazy, apenas quando solicitadas.
```javascript
import React from 'react';
import Link from 'next/link';
import Router from 'next/router';

const indexPage = () => (
    <div>
        <h1>The Main Page</h1>
        <p>Go to <Link href="/auth"><a>Auth</a></Link></p>
        <button onClick={() => Router.push('/auth')}>Go to Auth</button>
    </div>
);

export default indexPage; 
```
* `Link` e `Router` são componentes que permitem interagir com o sistema de rotas.

# 005 Next.js & Components & Pages
--> A parte da pasta `pages`, o código da aplicação pode ser organizado livremente, como uma pasta 
components. O código será referenciado por uma page e será renderizado juntamente.

# 006 Styling our App in Next.js
--> Estilos ainda podem ser feitos de maneira inline, mas não é possível utilizar módulos CSS como ocorre 
diretamente com Webpack. Next.js faz uso internamente de um pacote chamado `styled-jsx`, o que consiste de 
uma outra maneira de especificar estilos e que é compatível na ferramenta.
```javascript
const user = () => (
    <div>
        <h1>User</h1>
        <style jsx>{`
            h1 {
                color: red;
                border: 1px solid #ccc;
            }
        `}</style>
    </div>
);
```
* O código CSS é especificado como uma string literal dentro da tag `<style jsx>{...}</style>`.

# 007 Handling (404) Errors
--> O tratamente de rotas inexistentes podem feito criando um arquivo chamado `_error.js` na pasta `pages`.
```javascript
import React from 'react';
import Link from 'next/link';

const errorPage = () => (
    <div>
        <h1>Ops, something went wrong.</h1>
        <p>Try <Link href="/"><a>goin back</a></Link>.</p>
    </div>
);

export default errorPage; 
```

# 008 A Special Lifecycle Hook
--> Next.js permite que código seja executado antes de um componente ser renderizado no servidor, de maneira 
que dados externos possam ser obtidos e a página final seja devolvida com todo seu conteúdo carregado. Tanto 
em componentes funcionais ou baseados em classe, pode ser definido a função estática `getInitialProps(ctx)`:
```javascript
class IndexPage extends Component {

    static async getInitialProps(context) {
        const appName = await new Promise(res => {
            setTimeout(() => res('Appname'), 1000);
        });

        return { appName };
    }

    render() {
        return (
            <div>
                <h1>The Main Page of {this.props.appName}</h1>
            </div>
        );
    }
}

export default IndexPage;
```
* `getInitialProps` recebe um objeto que representa o contexto da requisição e deve devolver o objeto 
representando as `props` do componente.
* Caso não seja declarado com `async`, terá que devolver uma promisse para o objeto `props`.
* O parâmetro `context` permite ter acesso a query params e próprio par de objetos representando a request 
e a response do node.

--> Em componentes funcionais:
```javascript
const authIndexPage = (props) => (
    <div>
        <h1>The Auth Index Page - {props.appName}</h1>
    </div>
);

authIndexPage.getInitialProps = context => {
    return new Promise(res => {
        setTimeout(() => res({
            appName: "Super App (Auth)"
        }), 1000);
    });
};

export default authIndexPage;
```

# 009 Deploying our App
--> O script `npm run build` cria uma pasta chamada `.next` contendo o resultado da otimização do código 
para ser executada em produção. 
O código gerado é javascript e precisa ser executado em servidor `Node`.

--> O processo de execução é iniciado com o script `npm run start`.