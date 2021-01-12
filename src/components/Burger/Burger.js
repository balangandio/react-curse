import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngrediant/BurgerIngrediant';

const burger = props => {
    let transformedIngredients = Object.keys(props.ingredients)
        .map(key => {
            return [...Array(props.ingredients[key])].map((_, i) => (
                <BurgerIngredient key={key + i} type={key} />
            ));
        }).reduce((prev, next) => prev.concat(next), []);

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please, start adding ingredients!</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />

            {transformedIngredients}

            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;