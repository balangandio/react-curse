# Cap 10 - Burger Builder Project Accessing a Server

# 007 Handling Errors
--> Uma maneira de gerenciar erros em requisições com Axios, consiste em criar um componente HOC que 
inclui os interceptadores nos objetos request/response, e exibe um modal/mensagem na ocorrência junto 
ao componente envolvido:
```javascript
import React, { useEffect, useState, Fragment } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axiosInstance) => {

    const interceptors = {
        _fnSetError: () => {},
        reqId: null,
        request(req) {
            this._fnSetError(null);
            return req;
        },
        resId: null,
        response(err) {
            this._fnSetError(err);
            return Promise.reject(err);
        }
    };

    interceptors.reqId = axios.interceptors.request.use(req => {
        return interceptors.request(req);
    });
    interceptors.resId = axios.interceptors.response.use(res => res, err => {
        return interceptors.response(err);
    });

    return props => {
        const [error, setError] = useState(null);
        interceptors._fnSetError = setError;

        const cleanUpCallback = () => {
            axios.interceptors.request.eject(interceptors.reqId);
            axios.interceptors.response.eject(interceptors.resId);
        };

        useEffect(() => cleanUpCallback, []);

        return (
            <Aux>
                <Modal show={error} modalClosed={() => setError(null)}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );
    }
};

export default withErrorHandler;
```
* É feito uso da função `eject()` no axios, uma vez que os interceptors registrados precisam ser 
removidos quando o componente é desmontado, quando uma nova página é exibida por exemplo. Pois do 
contrário o contexto em volta constituiria um vazamento de memória.
* No componente que faz uso de uma instância `axios`:
```javascript
import React from 'react';

import axios from './axios-custom.js';

class App extends Component {
    ...
}
export default withErrorHandler(App, axios);
```