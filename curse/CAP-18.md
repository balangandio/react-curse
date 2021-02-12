# Cap 18 - Adding Authentication to our Burger Project

# 002 Understanding Authentication in Single Page Applications
--> Como aplicações React são SPAs, a autenticação é comumente implementada com o padrão OAuth, 
onde o cliente carrega consigo sua identificação (token) que pode ser atestada pelo servidor a 
cada requisição.

# 010 Logging Users Out
--> É comumente definido um período de validade para tokens de autenticação, que quando expirado 
força uma ação de logout ou de renegociação de um novo:
```javascript
export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkAuthTimeout = (expirationTimeMilli) => {
    return dispatch => {
        setTimeout(() => dispatch(logout()), expirationTimeMilli);
    };
};

export const auth = (email, pass) => {
    return dispatch => {
        dispatch(authStart());

        axios.post('/auth', {email, pass})
            .then(resp => ({ userId: email, token: '123asd', expirationTime: 3600 }))
            .then(authData => {
                dispatch(authSuccess(authData));
                dispatch(checkAuthTimeout(authData.expirationTime * 1000))
            })
            .catch(error => dispatch(authFail(error)));
    };
};
```
* No momento de autenticação é definido um timeout com `checkAuthTimeout()` para acionamento da 
action `AUTH_LOGOUT`.

# 011 Accessing Protected Resources
--> Um token acessível na store da aplicação pode ser fornecido indiretamente pela função `connect()`, 
ou pode ser acessado diretamente com o parâmetro `getState` disponibilizado pelo middleware `thunk`:
```javascript
export const getOrders = (token) => {
    return (dispatch, getState) => {
        const authToken = token || getState().auth.token;

        dispatch(ordersRetriveStarted());

        axios.get('/orders?token=' + authToken)
            .then(orders => dispatch(ordersRetrived(orders)))
            .catch(error => dispatch(ordersRetriveFail(error)));
    };
};
```

# 014 Forwarding Unauthenticated Users
--> O processo de logout consiste de retirar o token da store e redirecionar o usuário:
* Link:
```javascript
import React from 'react';
import { NavLink } from 'react-router-dom';

const logoutLink = props => (
    <li >
        <NavLink to="/logout" exact>{props.children}</NavLink>
    </li>
);

export default logoutLink;
```
* Logout redirect:
```javascript
class Logout extends Component {
    componentDidMount() {
        this.props.logout();
    }

    render() {
        return <Redirect to="/" />;
    }
}

const dispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout())
    };
};

export default connect(undefined, dispatchToProps)(Logout);
```

# 016 Persistent Auth State with localStorage
--> O estado da autenticação pode ser preservado entre posteriores carregamentos da aplicação com 
a ajuda da API `localstorage` disponibilizada pelos browsers.
* Armazenamento dos dados da atenticação no login:
```javascript
const storeAuthData = ({ expirationTime, token, userId }) => {
    const expirationDate = new Date(new Date().getTime() + authData.expirationTime * 1000);

    localStorage.setItem('token', authData.token);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('userId', authData.userId);
}

export const auth = (email, pass) => {
    return dispatch => {
        dispatch(authStart());

        axios.post('/auth', {email, pass})
            .then(resp => ({ userId: email, token: '123asd', expirationTime: 3600 }))
            .then(authData => {
                storeAuthData(authData);

                dispatch(authSuccess(authData));
                dispatch(checkAuthTimeout(authData.expirationTime * 1000))
            })
            .catch(error => dispatch(authFail(error)));
    };
};
```
* Recuperação do estado armazenado:
```javascript
export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));

            if (expirationDate > new Date()) {
                dispatch(authSuccess(token, localStorage.getItem('userId')));
                dispatch(checkAuthTimeout(expirationDate.getTime() - new Date().getTime()));
            } else {
                dispatch(logout());
            }
        }
    };
};
```
* Na inicialização da aplicação o estado armazenado pode ser recuperado:
```javascript
class App extends Component {
    componentDidMount() {
        this.props.authCheckState();
    }

    render() {
        return (...)
    }
}
```
* Logout limpa o localstore:
```javascript
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT
    };
};
```

# 018 Ensuring App Security
--> O localstorage do browser é acessível por ataques cross-site scripting ou o token pode ser 
compartilhado pelo próprio usuário. Por isso estratégias de expiração e renovação são usualmente 
utilizadas para dificultar este tipo de cenário.

--> A extratégia de renovação dos tokens de autenticação pode ser abordada de diferentes maneira. 
Necessariamente uma não é melhor que a outra.
* O token pode ter uma validade definida e sem renovação, requerendo que o login seja feito novamente;
* O token pode ser renovado a cada requisição;
* O token pode ser renovado após ser expirado.

# 019 Guarding Routes
--> Rotas que requerem autenticação podem ser protegidas não renderizando as mesmas:
```javascript
class App extends Component {
    render() {
        let routes = (
            <Switch>
                <Route path="/auth" component={Auth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        );
        
        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/orders" component={Orders} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/" exact component={BurgerBuilder} />
                    <Redirect to="/" />
                </Switch>
            );
        }

        return <Layout>{routes}</Layout>;
    }
}
```
* Ao final, `<Redirect to="/" />` é acionado caso nenhuma das rotas acima são compatível.