# Cap 13 - Forms and Form Validation

# 007 Handling User Input
--> De maneira a respeitar a imutabilidade de estado ao atualizar uma propriedade aninhada no `state` 
de um componente, os contextos presentes no percurso hierárquico do topo até a propriedade precisam 
ser atualizados. Caso exista um componente que tem ciência apenas de um dos contextos intermediários, 
sua renderização será disparada, e assim também na sua árvore hierarquica sucessivamente até atualizar 
de fato o componente responsável por gerenciar a propriedade.
```javascript
class Form extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        // context to update
        orderForm: {
            // context to update
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                // property to update
                value: ''
            },
            other: {
                elementType: 'select'
            }
        }
    };

    updateState_orderForm_name_value(newValue) {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedName = {
            ...updatedOrderForm.name
        };

        updatedName.value = newValue;
        updatedOrderForm['name'] = updatedName;

        this.setState({ orderForm: updatedOrderForm });
    }
}
```