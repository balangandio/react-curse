# Cap 15 - Adding Redux to our Project

# 003 Basic Redux Setup
--> Quando trabalhando navegação e Redux, a store deve ser provida na raiz da stack, em volta do `BrowserRouter`:
```javascript
const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);
```

# 004 Finishing the Reducer for Ingredients
--> No ES6 é possível definir em objetos propriedades cujo nome se encontra em variáveis:
```javascript
const propName = 'description';
const propValue = '...';
const obj = {
    [propName]: propValue
};
```