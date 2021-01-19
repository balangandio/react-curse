import React from 'react';

import classes from './Order.module.css';

const order = props => {
    const ingredients = Object.keys(props.ingredients)
        .map(key => {
            return { name: key, quantity: props.ingredients[key] };
        });

    return (
        <div className={classes.Order}>
            <p>Ingredients: {
                ingredients.map(ingredient => (
                    <span key={ingredient.name} className={classes.Ingredient}>{ingredient.name} ({ingredient.quantity})</span>
                )) }</p>
            <p>Price: <strong>USD {props.price.toFixed(2)}</strong></p>
        </div>
    );
}

export default order;