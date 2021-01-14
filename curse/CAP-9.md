# Cap 9 - Reaching out to the Web (Http  Ajax)

# 003 Understanding our Project and Introducing Axios
--> Como uma aplicação javascript, React pode fazer uso da API nativa oferecidada pelos browsers `XMLHttpRequest` 
para efetuar requisições HTTP. Contudo a mesma tarefa pode ser feita de maneira mais direta e menos repetitiva 
com o uso de blibliotecas a parte.

--> `Axios` é uma biblioteca bastante utilizada em conjunto com React para interagir com recursos HTTP.
* Install: `npm install --save axios`

# 004 Creating a Http Request to GET Data
--> Dentro do life cycle de um componente, o método `componentDidMount()` é o local adequado para realizar operações 
como carregamento de dados de uma API.

--> Uma requisição GET pode ser feito com `axios.get()`:
```javascript
import React, { Component } from 'React';
import axios from 'axios';

class PostList extends Component {
    componentDidMount() {
        axios.get('http://jsonplaceholder.typicode.com/posts')
            .then(response => {
                console.log(response);
            });
    }
}
```
* É retornada uma Promise referente a um objeto que representa a resposta HTTP.

# 008 Fetching Data on Update (without Creating Infinite Loops)
--> Quando queremos acionar uma API quando o componente é atualizado, o método `componentDidUpdate()` pode 
ser utilizado. Todavia deve ser evitado acionar novos ciclos de atualização caso o dado já tenha sido recuperado 
em um ciclo anterior:
```javascript
import React, { Component } from 'React';
import axios from 'axios';

class PostList extends Component {
    state: { loadedPost: null }

    componentDidUpdate() {
        if (!this.state.loadedPost || (this.state.loadedPost.id !== this.props.id)) {
            axios.get(`http://jsonplaceholder.typicode.com/posts/${this.props.id}`)
                .then(resp => this.setState({ loadedPost: resp.data }));
        }
    }
}
```
* `this.setState()` aciona um novo ciclo de atualização, que é então evitado pela sentença condicional com `if`.

# 009 POSTing Data to the Server
--> Resquisições POST podem ser feitas com `axios.post()`:
```javascript
import React, { Component } from 'React';
import axios from 'axios';

class PostList extends Component {
    postDataHandler = () => {
        const post = {
            title: this.state.title,
            body: this.state.body,
            author: this.state.author
        };

        axios.post('http://jsonplaceholder.typicode.com/posts', post)
            .then(resp => alert('Done!'));
    }
}
```
* O corpo da requisição corresponde ao segundo parâmetro da função;
* O `Content-type` padrão neste caso é `application/json`.

# 010 Sending a DELETE Request
--> Resquisições DELETE podem ser feitas com `axios.delete()`:
```javascript
import React, { Component } from 'React';
import axios from 'axios';

class PostList extends Component {
    deletePostHandler = () => {
        axios.delete(`http://jsonplaceholder.typicode.com/posts/${this.props.id}`)
            .then(resp => this.setState({ deleted: true }));
    }
}
```

# 012 Handling Errors Locally
--> Erros em requisições HTTP com `axios` são gerenciados no objeto Promise:
```javascript
import React, { Component } from 'React';
import axios from 'axios';

class PostList extends Component {
    deletePostHandler = () => {
        axios.delete(`http://jsonplaceholder.typicode.com/posts/${this.props.id}`)
            .then(console.log)
            .catch(err => {
                this.setState({error: true});
            });
    }
}
```

# 013 Adding Interceptors to Execute Code Globally
--> É possível definir comportamentos globais aplicáveis a qualquer requisição feita com Axios por meio de 
`interceptors`. Na inicialização da aplicação, interceptadores para o objeto `request` podem ser definidos 
com a função `axios.interceptors.request.use()`, e para o objeto `response` com `axios.interceptors.response.use()`:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';

axios.interceptors.request.use(request => {
    // do something with [request]
    return request;
}, error => {
    // do something with [error]
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // do something with [response]
    return request;
}, error => {
    // do something with [error]
    return Promise.reject(error);
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```
* A função recebe callbacks para o objeto que representa a request que está sendo feita, e para um eventual erro;
* Enquanto o callback de erro para `request` intercepta problemas ocorridos ao tentar inicializar a requisição, como 
problemas de conectividade, o callback para `response` intercepta problemas ao tentar processar a resposta ou quando 
status de erro HTTP são recebidos, como 404 e 500;
* Os callbaks devem retornar o objeto do parâmetro para que o fluxo de execução responsável por iniciar a requisição 
prossiga, caso assim seja o desejado.

# 015 Setting a Default Global Configuration for Axios
--> É possível definir configurações globais no objeto `axios.default`.
* URL base:
```javascript
axios.default.baseURL = 'http://example.com';
```
* Default headers para qualquer requisição:
```javascript
axios.default.headers.common['Authorization'] = '<token>';
```
* Default headers para requisições POST:
```javascript
axios.default.headers.post['Content-Type'] = 'application/json';
```

# 016 Creating and Using Axios Instances
--> Interceptors e default settings não nescessariamente precisam ser aplicados globalmente. Axios permite que instâncias 
da sua API sejam criadas cada uma com suas configurações e interceptadores, com a função `axios.create()`.
* Em um arquivo `src/axios.js`:
```javascript
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://other.server.com'
});
instance.defaults.header.common['Authorization'] = '<othertoken>';
instance.interceptors.request.use(req => {
    return req;
});

export default instance;
```
* Requisições são feitas então com a API customizada:
```javascript
import axios from 'src/axios.js';

axios.get('/resource').then(() => {...});
```

--> Apesar de configurações definidas em instâncias são aplicáveis somente às mesmas, configurações globais ainda afetam 
instâncias a não se que as memas sobrescrevam tais definições:
```javascript
import axios from 'axios';

axios.default.baseURL = 'http://example.com';
axios.default.headers.common['Authorization'] = '<token>';

// ...

const instance = axios.create({
    baseURL: 'http://other.server.com'
});
instance.defaults.header.common['Authorization'] = '<othertoken>';
```
* `instance` sobrescreve as definições de baseURL e do header Authorization da configuração global.