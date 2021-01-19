# Cap 12 - Adding Routing to our Burger Project

# 008 Order Submission & Passing Data Between Pages
--> O callback recebido no atributo `render` de `Route` tem como parâmetro o objeto `props` do componente host:
```javascript
class Blog extends Component {
    render() {
        return (
            <div>
                <Route path="/checkout" render={props => (<CheckoutForm {...props} />)} />
            </div>
        );
    }
}
```

# 010 Implementing Navigation Links
--> O Componente `NavLink` possui como comportamento a inclusão da className `active`. Quando trabalhamos com 
módulos CSS e fazemos referência a este nome [ `.Links a.active ` ], ocorre a divergência entre o className `active` 
incluido dinamicamente pelo componente, e a derivação randômica de `.active` produzida na geração do bundle pela 
funcionalidade de módulos CSS. Para evitar isso, podemos atribuir a classe definida no arquivo CSS no atributo 
`activeClassName`:
```javascript
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.css';

const navigationItem = props => (
    <li>
        <NavLink to={props.link} activeClassName={classes.active}>{props.children}</NavLink>
    </li>
);
```