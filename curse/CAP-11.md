# Cap 11 - Multi-Page-Feeling in a Single-Page-App Routing

# 002 Routing and SPAs
--> Aplicações SPA gerenciam múltiplas páginas por meio de um mecanismo de roteamente que identifica a alteração do URL path do 
browser e se encarrega acionar a renderização da próxima página solicitada, subtituindo o conteúdo da página atualmente exibida. 
No React, o mecanismo de roteamente é implementado por um pacote a parte.

# 004 Setting Up the Router Package
--> Os pacotes `react-router` e `react-router-dom` justos consistem do mecanismo padrão de rotas do React para SPAs web.
* Install: `npm install --save react-router react-router-dom`

--> Para habilitar a utilização do sistema de rotas na aplicação, é necessário envolver um entry point com o componente `BrowserRouter`:
```javascript
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Blog from './containers/Blog/Blog';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Blog />
            </BrowserRouter>
        );
    }
}
```

# 007 Setting Up and Rendering Routes
--> O componente `Route` permite renderizar código JSX condicionalmente mediante ao path atualmente exibido:
```javascript
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Route path="/" exact render={() => <h1>Welcome</h1>} />
                <Route path="/new-port" render={() => <h1>New Post page</h1>} />
                <Route path="/posts" render={() => <h1>Post page</h1>} />
            </BrowserRouter>
        );
    }
}
```
* O atributo `render` recebe uma função que retorna o código JSX;
* O comportamento padrão é exibir o conteúdo caso o path indicado está inclui do no path corrente. Definindo o atributo `exact`, 
o path precisa corresponder exatamente.

# 008 Rendering Components for Routes
--> O componente `Route` recebe pelo atribudo `component` uma referência a um componente:
```javascript
class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Route path="/new-port" component={NewPost} />
            </BrowserRouter>
        );
    }
}
```

# 010 Using Links to Switch Pages
--> O componente `Link` permite renderizar links `<a href>` que quando acionados não atualizam a página do browser, mas sim apenas 
alterna o path exibido e dispara a atualização do mecanismo de rotas:
```javascript
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Posts from './Posts/Posts';
import NewPost from './NewPost/NewPost';

class Blog extends Component {

    render () {
        return (
            <div className="Blog">
                <header>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to={{
                                pathname: '/new-post',
                                search: '?something=northing',
                                hash: '#nowhere'
                            }}>New Post</Link></li>
                        </ul>
                    </nav>
                </header>
                <Route path="/" exact component={Posts} />
                <Route path="/new-post" component={NewPost} />
            </div>
        );
    }
}
```
* Uma aplicação simples de duas páginas;
* O atributo `to` pode receber o path em uma string, ou pode receber um objeto especificando configurações a mais como query string 
e hash.


# 011 Using Routing-Related Props
--> Componentes renderizados com `Route` recebem em `props` três propriedades relacionadas a rota encaminhada:
* `history`: referência a API history, que permite interagir programaticamente com o sistema de rotas;
* `location`: informações sobre o path;
* `match`: informações e parâmetros da rota.

# 012 The withRouter HOC & Route Props
--> Componentes que estão dentro da estrutura do componente renderizado com `<Route component={}`, não recebem em `props` as propriedades 
do sistema de rota assim como o mesmo. Para conseguir essas mesmas propriedades em ter que encaminha-las manualmente, é oferecido a 
função HOC `withRouter()`:
```javascript
import React from 'react';
import { withRouter } from 'react-router-dom';

const post = (props) => (
    <ul>
        <li>{ props.match }</li>
        <li>{ props.location }</li>
        <li>{ props.history }</li>
    </ul>
);

export default withRouter(post);
```

# 013 Absolute vs Relative Paths
--> O path indicado no componente `Link` sempre é tratado como relativo ao domínio acessado, e não relativo ao domínio + path atual. 
Para conseguir este comportamente, é necessário especificá-lo de maneira completa [ `/posts[/post]` ], o que pode ser feito com a 
ajuda da propriedade `match.url` oferecida pelo sistema de rotas:
```javascript
import React from 'react';
import { withRouter, Link } from 'react-router-dom';

const post = (props) => (
    <div>
        <Link to={{
            pathname: this.props.match.url + '/post'
        }}>Subpath</Link>
    </div>
);

export default withRouter(post);
```

# 015 Styling the Active Route
--> O componente `NavLink` funciona da mesma maneira que `Link`, todavia oferece a capacidade de customização de estilo mediante 
ao estado de ativo/inativo que a mesma se encontra em relação ao path em exibição.
```javascript
import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';

const post = (props) => (
    <div>
        <NavLink to={{ pathname: this.props.match.url + '/post' }}
            activeClassName="my-active"
            activeStyle={{textDecoration: 'underline'}}
            exact>Subpath</NavLink>
    </div>
);

export default withRouter(post);
```
* Por padrão, quando o path do link está ativo o elemento recebe a className `active`. O atributo `activeClassName` permite customizar 
este nome;
* O atributo `activeStyle` permite definir estilos diretamente no elemento quando o path fica ativo;
* Caso não seja definido o atributo `exact`, o link se torna ativo também para subpaths.

# 016 Passing Route Parameters
--> A existência de parâmetros na rota pode ser especificado no componente `Route` identificando a variável com o caracter `:`.
```javascript
const blog = props => {
    return (
        <div className="Blog">
            <Route path="/" exact component={Posts} />
            <Route path="/new-post" component={NewPost} />
            <Route path="/posts/:postId" component={Post} />
        </div>
    );
}
```

--> O componente `Link` precisa neste caso ter sua URL especificada de forma dinâmica:
```javascript
const header = props =>  {
    return (
        <header>
            <nav>
                <ul>
                    {
                        props.posts.map(post => (
                            <li><Link to={'/' + post.id}>{post.name}</Link></li>
                        ));
                    }
                </ul>
            </nav>
        </header>
    );
};
```

# 017 Extracting Route Parameters
--> A extração de um parâmetro de rota é feita pelo sistema de rotas e injetado na propriedade `props.match.params` do componente 
navegado:
```javascript
const post = props => {
    const [ post, setPost ] = useState(null);

    useEffect(() => {
        axis.get(`/post/${ props.math.params.postId }`)
            .then(resp => setPost(resp.data));
    }, []);

    return (
        <div>
            { post ? <p>{ post.name }</p> : <p>Post not loaded</p> }
        </div>
    );
};
```

# 019 Using Switch to Load a Single Route
--> Quando uma rota parametrizada entra em conflito com uma rota fixa, e o problema não pode ser resolvido acrescentando distinções 
ao path [ `/:id`, `/posts/:id` ], o componente `Switch` pode ser utilizado:
```javascript
import { Route, Switch } from 'react-router-dom';

const blog = props => {
    return (
        <div className="Blog">
            <Route path="/" exact component={Posts} />
            <Switch>
                <Route path="/new-post" component={NewPost} />
                <Route path="/:postId" component={Post} />
            </Switch>
        </div>
    );
};
```
* Switch permite que apenas uma das rotas seja selecionada segundo a ordem de declaração das mesmas;
* Caso o conflito não seja resolvido, ao acessar `/new-post` a rota `/:postId` seria também renderizada com o parâmetro `props.match.params.postId == 'new-post'`.

# 020 Navigating Programmatically
--> Programaticamente a navegação entre rotas pode ser feita com o uso da propriedade disponibilizada pelo sistema rotas `props.history`. 
O objeto contém métodos de interação com a pilha de navegação do browser, como `history.push()` que introduz uma nova rota:
```javascript
const header = props =>  {
    return (
        <header>
            <nav>
                <ul>{
                        props.posts.map(post => (
                            <li><span onClick={() => props.history.push(`/${post.id}`)}>{post.name}</span></li>
                        ));
                }</ul>
            </nav>
        </header>
    );
};
```
* O path poderia ser especificado como um objeto também: `props.history.push({ pathname: '/' + id })`.

# 022 Understanding Nested Routes
--> Quando um componente renderizado com `Route` declara também outras rotas, temos o que é chamado de `nested routes`. Quando isso 
ocorre, deve-se ter em mente que a rota interna deve ser compatível com a externa, pois a mesma só será renderizada se a rota superior 
também assim for. E ainda, a rota superior não deve declarar o parâmetro `exact` de maneira que sua renderização não seja impedida ao 
acessar a rota interna.
```javascript
const blog = props => {
    return (
        <div className="Blog">
            <Switch>
                <Route path="/new-post" component={NewPost} />
                <Route path="/" component={Posts} />
            </Switch>
        </div>
    );
};

const Posts = props => {
    return  (
        <div>
            <p>Posts...</p>
            <Route path={props.match.url + '/:id'} component={SinglePost} />
        </div>
    );
};

const SinglePost = props => {
    return (
        <div>
            <p>SinglePost inside Posts...{ props.match.params.postId }</p>
        </div>
    );
};
```
* A declaração da rota aninhada especifica o path respeitando a rota superior fazendo uso de `props.match.url`;
* O conflito existente ao acessar `/new-post` com `/:id` poderia ser resolvido com o atributo `extact` na rota `/`. Todavia isso impediria 
que a rota aninhada seja atingida. Nesta situação, o conflito pode ser resolvido com o uso de `Switch`.

# 023 Creating Dynamic Nested Routes
--> Quando trabalhamos com uma rota parametrizada e navegamos entre diferentes parâmetros, o componente renderizado pela rota se mantém 
montado por uma questão de otimização, pois visto pelo seu ponto de vista, apenas suas `props` sofrem alteração. Neste caso, deve também 
ser feito uso de `componentDidUpdate()` para responder a essas alterações.
```javascript
const Posts = props => {
    return  (
        <div>
            <p>
                <Link to={props.match.url + '/1'}>One</Link>
                <Link to={props.match.url + '/2'}>Two</Link>
            </p>
            <Route path={props.match.url + '/:id'} component={Post} />
        </div>
    );
};

//...

class Post extends Component {
    state = { post: null };

    componentDidMount() { loadData(); }

    componentDidUpdate() { loadData(); }

    loadData() {
        axis.get(`/post/${ props.math.params.id }`)
            .then(resp => setPost(resp.data));
    }

    render() {
        return (
            <div>
                { this.state.post ? <p>{ this.state.post.name }</p> : <p>Post not loaded</p> }
            </div>
        );
    }
}
```
* `componentDidMount()` responde a montagem do componente, e `componentDidUpdate()` às próximas alterações do parâmetro da rota.

# 024 Redirecting Requests
--> O componente `Redirect` permite redirecionar o navegação quando determinado path é solicitado:
```javascript
import { Route, Switch, Redirect } from 'react-router-dom';

const blog = props => {
    return (
        <div className="Blog">
            <Switch>
                <Route path="/new-post" component={NewPost} />
                <Route path="/:postId" component={Post} />
                <Redirect from="/" to="/new-post" />
            </Switch>
        </div>
    );
};
```
* Como `/` é compatível com qualquer outra rota, caso seja tentado um acesso em demais páginas, é feito o redirecionamento para `/new-post`;
* Só é permitido especificar o atributo `from` quando o uso é feito dentro de um `Switch`.

# 025 Conditional Redirects
--> Caso seja feito uso de `Redirect` fora de um `Switch`, apenas com atributo `to`, no momento que o componente é renderizado o 
redirecionalmente é feito e o componente não é exibido no browser. Com este comportamente, o uso condicional se torna interessante:
```javascript
class Post extends Component {
    state = { submited: false };

    render() {
        let redirection = this.state.submited ? <Redirect to="/confirmed" /> : nulle;

        return (
            <div>
                { redirection }
                <button onClick={() => this.setState({ submited: true })}>Submit</button>
            </div>
        );
    }
}
```

# 026 Using the History Prop to Redirect (Replace)
--> O método `history.push()` pode parecer oferecer um comportamento intercambiável com `Redirect`, mas com o redirecionamento o estado 
atual da pilha de navegação é substituido pela nova página, ao acionar o botão back no browser não somos encaminhados de volta a página 
anterior. Para conseguir o mesmo comportamento de `Redirect`, é necessário usar `history.replace()`:
```javascript
class Post extends Component {
    render() {
        return (
            <div>
                <button onClick={() => this.props.history.replace('/confirmed'))}>Submit</button>
            </div>
        );
    }
}
```

# 027 Working with Guards
--> Rotas podem ser condicionalmente renderizadas de maneira a proteger um componente de ser acessado, como em esconder páginas autenticadas.
```javascript
const blog = props => {
    return (
        <div className="Blog">
            <Switch>
                <Route path="/new-post" component={NewPost} />
                {
                    props.authenticated ? <Route path="/:postId" component={Post} /> : null
                }
                <Redirect from="/" to="/new-post" />
            </Switch>
        </div>
    );
};
```
* A rota `/:postId` não é renderizada. Caso seja tentado um acesso a mesma, ocorrerá um redirecionamenteo para `/new-post`.

# 028 Handling the 404 Case (Unknown Routes)
--> Quando o atributo `path` não é especificado no componente `Route`, a rota especificada passa a ser compatível com qualquer path. 
Dentro de um `Switch`, esse comportamento se torna útil para tratar o acesso a páginas inexistentes:
```javascript
const blog = props => {
    return (
        <div className="Blog">
            <Switch>
                <Route path="/new-post" component={NewPost} />
                <Route path="/:postId" component={Post} />
                <Route render={() => <h1>404 not found</h1>} />
            </Switch>
        </div>
    );
};
```
# 029 Loading Routes Lazily
--> Todas as rotas da aplicação não precisam ser carregadas logo no momento inicial quando o download do `bundle` é feito. Os componentes 
atrelados a rotas podem ser armazenados em arquivos separados, `chunks`, e solicitados ao servidor caso ocorra a navegação para os mesmos. 
Isso é possível fazendo uso da síntaxe de importação assíncrona do javascript e da implementação oferecida por padrão pela ferramento `webpack`.
* Um utilitário para importação assíncrona pode ser criado como um componente HOC:
```javascript
import React, { Component } from "react";

const asyncComponent = (importComponent) => {
    return class extends Component {
        state = { component: null };

        componentDidMount() {
            importComponent()
                .then(cmp => this.setState({ component: cmp.default }));
        }

        render() {
            const C = this.state.component;
            return C ? <C {...this.props} /> : null;
        }
    }
};

export default asyncComponent;
```
* O uso do utilitário pode ser feito substituindo a importação:
```javascript
import asyncComponent from '../../hoc/asyncComponent';

const AsyncNewPost = asyncComponent(() => {
    return import('./NewPost/NewPost');
});

const blog = props => {
    return (
        <div className="Blog">
            <Switch>
                <Route path="/new-post" component={ AsyncNewPost } />
                <Route path="/:postId" component={Post} />
                <Route render={() => <h1>404 not found</h1>} />
            </Switch>
        </div>
    );
};
```
* Quando `/new-post` é acessado, o browser carrega um arquivo como `0.chunk.js` contendo o código do componente;
* O carregamento assíncrono é um recurso que possui maior efeito em aplicações com grande volume de código.

# 030 Lazy Loading with React Suspense (16.6)
--> A partir da versão `16.6`, React passou a oferecer a função `React.lazy()` que permite carregar componentes e rotas de maneira 
assíncrona. A função recebe um callback que retorna a promise da importação. O uso do objeto resultante é feito envolvendo o mesmo 
no componente `Suspense`.
```javascript
import React, { Suspense } from 'react';

const NewPost = React.lazy(() => import('./NewPost/NewPost'));
const Footer = React.lazy(() => import('./Footer/Footer'));

const blog = props => {
    const [ showFooter, setShowFooter ] = useState(false);

    return (
        <div className="Blog">
            <button onClick={() => setShowFooter(true)}></button>
            {
                showFooter
                    ? <Suspense fallback={<h1>Loading...</h1>}><Footer /></Suspense>
                    : null
            }

            <Switch>
                <Route path="/new-post" render={() => (
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <NewPost />
                    </Suspense>
                )} />
                <Route path="/:postId" component={Post} />
                <Route render={() => <h1>404 not found</h1>} />
            </Switch>
        </div>
    );
};
```
* Em rotas é feito o uso no atributo `render`;
* `Suspense` recebe em um atributo chamado `fallback` um código JSX que será exibido enquando o carregamento não é finalizado.

# 031 Routing and Server Deployment
--> Quando a aplicação é servida em produção, o servidor web que distribui o bundle e demais arquivos não tem conhecimento de quais 
rotas existem ou não. Por isso o mesmo deve ser configurado para fornecer o `index.html` da aplicação independente da rota solicitada, 
pois em diante a aplicação saberá o que deverá ser exibido.

--> Muitas vezes a aplicação é executada em um ambiente compartilhado e fica restrita a um path específico do domínio. O componente 
`BrowserRouter` recebe em um atributo `basename` que permite configurar o sistema de rotas a sempre considerar este path na construção 
de links e navegação pelo histório:
```javascript
class App extends Component {
    render() {
        return (
            <BrowserRouter basename="/my-app">
                <Blog />
            </BrowserRouter>
        );
    }
}
```