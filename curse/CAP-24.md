# Cap 24 - Bonus Animations in React Apps

# 003 Using CSS Transitions
--> Uma das maneiras de implementar animações em aplicações web em geral, consiste em utilizar CSS Transitions:
```javascript
const modal = (props) => (
    <div className={[ 'Modal', props.show ? 'ModalOpen' : 'ModalClose' ].join(' ')}>
        <h1>A Modal</h1>
    </div>
);
```
```css
.Modal {
    position: fixed;
    z-index: 200;
    top: 30%;
    left: 25%;
    width: 50%;
    transition: all .3s ease-out;
}
.ModalOpen {
    opacity: 1;
    transform: translateY(0);
}
.ModalClose {
    opacity: 0;
    transform: translateY(-100%);
}
```
* `transition: all .3s ease-out` instrui o motor CSS do browser a transicionar qualquer propriedade em determinado período de tempo com animação
 do tipo ease-out;
* As classes `.ModalOpen` e `.ModalClose` estilizam o componente tornando o mesmo visível ou fora do campo de visão do usuário.

# 004 Using CSS Animations
--> Animações com CSS podem ser implementadas também com o próprio framework CSS Animations:
```css
.Modal {
    position: fixed;
    z-index: 200;
    top: 30%;
    left: 25%;
    width: 50%;
}
.ModalOpen {
    animation: openModal .4s ease-out forwards;
}
.ModalClose {
    animation: closeModal .4s ease-out forwards;
}

@keyframes openModal {
    0% { opacity: 0; transform: translateY(-100%); }
    50% { opacity: 1; transform: translateY(90%); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes closeModal {
    0% { opacity: 1; transform: translateY(0); }
    50% { opacity: .8; transform: translateY(60%); }
    100% { opacity: 0; transform: translateY(-100%); }
}
```
* As transições são descritas em `@keyframes { ... }` especificando o estado do elemento em momentos no tempo identificados por porcentagens;
* A propriedade `animation` identifica a animação que o elemento deve sofrer;
* A tag `forwards` identifica que o elemento deve manter o estado final resultante da animação.

# 005 CSS - Transition & Animations Limitations
--> Dado o fato que a implementação de animações com CSS está totalmente desconexa com o framework React, elementos ocultados com propriedades 
CSS nunca são removidos do DOM. E ao tentarmos coordenar transições com a exibição ou remoção de elementos na renderização, enfrentamos problemas 
com diferenças e timing entre os contextos CSS e React.

# 006 Using ReactTransitionGroup
--> O pacote `react-transition-group` consiste de uma maneira de implementar animações no conexto do React, em inclusão ou remoção de elementos 
do DOM.
* Install: `npm install --save react-transition-group`

--> É oferecido o componente `Transition` para implementar transições segundo as mudanças de estado `[entering -> entered]` e `[exiting -> exited]`.
```javascript
import { Transition } from 'react-transition-group';

class Block extends Component {
    state = { showBlock: true };

    toggle = () => this.setState(prev => ({ showBlock: !prev.showBlock }))

    render() {
        return (
            <div>
                <button onClick={this.toggle}>Toggle</button>
                <Transition in={this.state.showBlock} timeout={1000} mountOnEnter unmountOnExit>
                    { state => (
                        <div style={{
                            width: 100,
                            height: 100,
                            transition: 'opacity 1s ease-out',
                            opacity: state === 'exiting' ? 0 : 1
                        }} />
                    )}
                </Transition>
            </div>
        );
    }
}
```
* Realiza uma transição com o estilo `opacity` logo antes de remover uma div do DOM;
* A propriedade `in` especifica em qual estado o componente deve ir, false -> 'exited', true -> 'entered'.
* Transicionando entre 'entered' e 'exited', o estado adquire os estados temporários 'entering' e 'exiting' pelo período de tempo especificado 
pela propriedade `timeout`;
* `mountOnEnter` e `unmountOnExit` especificam que o elemento deve ser renderizado ao tentar ser exibido, e que o elemento deve ser removido do 
DOM quando ocultado;
* O componente recebe como children uma função tendo o estado como parâmetro e o conteúdo JSX como retorno.

# 007 Using the Transition Component
--> A exibição de um modal com inclusão e remoção de elemento do DOM pode ser feita com:
* Transições CSS:
```css
.Modal {
    position: fixed;
    z-index: 200;
    top: 30%;
    left: 25%;
    width: 50%;
}
.ModalOpen { animation: openModal .3s ease-out forwards; }
.ModalClose { animation: closeModal .3s ease-out forwards; }

@keyframes openModal {
    0% { opacity: 0; transform: translateY(-100%); }
    50% { opacity: 1; transform: translateY(90%); }
    100% { opacity: 1; transform: translateY(0); }
}

@keyframes closeModal {
    0% { opacity: 1; transform: translateY(0); }
    50% { opacity: .8; transform: translateY(60%); }
    100% { opacity: 0; transform: translateY(-100%); }
}
```
* Componente Modal:
```javascript
export default (props) => (
    <Transition in={props.show} timeout={300} mountOnEnter unmountOnExit>
        { state => {
            const cssClasses = [
                'Modal',
                state === 'entering'
                    ? 'ModalOpen'
                    : (state === 'exiting' ? 'ModalClose' : null)
            ];

            return (
                <div className={cssClasses.join(' ')}>
                    <h1>A Modal</h1>
                </div>
            );
        }}
    </Transition>
);
```

# 009 Animation Timings
--> Naturalmente é desejado que o timeout do componente `Transition` seja equivalente ao timeout das transições CSS. Todavia muitas vezes a duração 
da transição 'exting' difere da 'entering'. Para este caso é possível passar timeouts distintos com um objeto na propriedade `timeout`:
```javascript
export default (props) => (
    <Transition in={props.show} mountOnEnter unmountOnExit timeout={{
        enter: 400,
        exit: 1000
    }}>
        { state => (...)}
    </Transition>
);
```

# 010 Transition Events
--> O componente `Transition` oferece a posibilidade de responder a eventos relacionados a mudanças de estado:
```javascript
export default (props) => (
    <Transition in={props.show} mountOnEnter unmountOnExit timeout={400}
        onEnter={() => console.log('onEnter')}
        onEntering={() => console.log('onEntering')}
        onEntered={() => console.log('onEntered')}
        onExit={() => console.log('onExit')}
        onExiting={() => console.log('onExiting')}
        onExited={() => console.log('onExited')}>
        { state => (...)}
    </Transition>
);
```
* `onEnter`: momento em que o estado 'enter' é solicitado;
* `onEntering`: momento em que o estado 'entering' é iniciado;
* `onEntered`: momento em que o estado 'entered' é alcançado;
* `onExit`: momento em que o estado 'exit' é solicitado;
* `onExiting`: momento em que o estado 'exiting' é iniciado;
* `onExited`: momento em que o estado 'exited' é alcançado.

# 011 The CSSTransition Component
--> O componente `CSSTransition` pode ser utilizado quanto precisamos realizar uma transição simples de um elemento com classes CSS. Dado um classname, 
ele irá incluir variações do mesmo no elemento wrapper segundo os estados em transição.
* Especificação das animações nas classes CSS:
```css
.fade-slide-enter {}
.fade-slide-enter-active { animation: openModal .3s ease-out forwards; }
.fade-slide-exit {}
.fade-slide-exit-active { animation: closeModal 1s ease-out forwards; }
```
* `-enter` é definido quando o estado 'enter' se encontra selecionado;
* `-enter-active` é definido no estado 'entering';
* `-exit` é definido quando o estado 'exit' se encontra selecionado;
* `-exit-active` é definido no estado 'exiting';
* Componente CSSTransition:
```javascript
import { CSSTransition } from 'react-transition-group';

export default (props) => (
    <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={400}
        classNames="fade-slide">
        <div className="Modal">
            <h1>A Modal</h1>
        </div>
    </CSSTransition>
);
```

# 012 Customizing CSS Classnames
--> É possível especificar no componente `CSSTransition` quais classNames deve ser utilizados para os seus estados:
```javascript
import { CSSTransition } from 'react-transition-group';

export default (props) => (
    <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={400}
        classNames={{
            enter: '',
            enterActive: 'ModalOpen',
            exit: '',
            exitActive: 'ModalClosed'
        }}>
        <div className="Modal">
            <h1>A Modal</h1>
        </div>
    </CSSTransition>
);
```

# 013 Animating Lists
--> Quando estamos lidando com conjuntos de componentes incluidos dinamicamente, podemos animar a saída e entrada dos componentes fazendo uso de 
`TransitionGroup`. Este componente funciona como um wrapper para `CSSTransition` e `Transition` responsável por gerenciar a propriedade `in` destes 
mesmos componentes em respeito ao momento que são renderizados e retirados do DOM:
```javascript
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default (props) => {
    const listItems = this.props.items((item, i) => (
        <CSSTransition key={`item${i}`} classNames="fade" timeout={300}>
            <p>Item {item}</p>
        </CSSTransition>
    ));

    return (
        <TransitionGroup component="ul" className="List">
            { listItems }
        </TransitionGroup>
    );
}
```
* A propriedade `component` permite definir o elemento wrapper para a lista;
* Os elementos da lista não definem a propriedade `in`.

# 014 Alternative Animation Packages
--> Há inúmeros outros pacotes no ecosistema React que permitem implementar animações com maior controle e complexidade. Os princiais são:
* `react-motion`: animações de elementos simulando um ambiente físico;
* `react-move`: animações com controles mais precisos;
* `react-router-transition`: animações entre rotas.