import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliar/Auxiliar';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSumary from '../../components/Burger/OrderSumary/OrderSumary';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 0,
        purchasable: false,
        purchasing: false
    };

    purchasaHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        alert('You continue!');
    }

    addIngredientHandler = type => {
        this._update(1, type);
    }

    removeIngredientHandler = type => {
        this._update(-1, type);
    }

    _updatePurchaseState(ingredients) {
        const sum = Object.values(ingredients)
            .reduce((prev, next) => prev + next, 0);

        this.setState({ purchasable: sum > 0 });
    }

    _update(amount, type) {
        const oldCount = this.state.ingredients[type];
        let ingredientPrice = INGREDIENT_PRICES[type];

        if (amount < 0) {
            if (oldCount <= 0) {
                return;
            }

            ingredientPrice *= -1;
        }

        const updatedCounted = oldCount + amount;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCounted;
        const oldPrice = this.state.totalPrice;

        const totalIngredients = Object.values(updatedIngredients)
            .reduce((prev, next) => prev + next, 0);

        const newPrice = totalIngredients > 0
            ? oldPrice + ingredientPrice
            : 0;

        this.setState({ totalPrice: newPrice, ingredients:  updatedIngredients});
        this._updatePurchaseState(updatedIngredients);
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.pushchaseCancelHandler}>
                    <OrderSumary ingredients={this.state.ingredients} 
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinue={this.purchaseContinueHandler}
                        price={this.state.totalPrice} />
                </Modal>

                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.purchasaHandler}
                    price={this.state.totalPrice} />
            </Aux>
        );
    }
}

export default BurgerBuilder;