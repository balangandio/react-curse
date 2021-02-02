# Cap 17 - Redux Advanced Burger Project

# 002 Installing the Redux Devtools
--> Caso atualmente a aplicação não faça uso de um `enhancer`, a configuração da extensão Redux Devtools se resume a:
```javascript
import reducer from './store/reducer';

const store = createStore(
    reducer,
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```