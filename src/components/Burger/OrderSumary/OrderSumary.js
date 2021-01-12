import React from 'react';

import classes from './OrderSumary.module.css';
import Aux from '../../../hoc/Auxiliar/Auxiliar';
import Button from '../../UI/Button/Button';

const orderSumary = props => {
    const ingredientsSumary = Object.keys(props.ingredients).map(k => {
        return { name: k, quantity: props.ingredients[k] };
    });

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredientes:</p>
            <ul className={classes.OrderList}>
                {ingredientsSumary.map(ing => (
                    <li key={ing.name}>
                        <span style={{textTransform: 'capitalize'}}>{ing.name}</span>: {ing.quantity}
                    </li>
                ))}
            </ul>
            <p><strong>Total Price: </strong>{props.price.toFixed(2)}</p>
            <p>Continue to Checkout</p>
            <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinue}>CONTINUE</Button>
        </Aux>
    );
};

export default orderSumary;