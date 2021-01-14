import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliar/Auxiliar';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSumary from '../../components/Burger/OrderSumary/OrderSumary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: null
    };

    componentDidMount() {
        axios.get('/posts')
            .then(resp => {
                return { salad: 0, bacon: 0, cheese: 0, meat: 0 };
            }).then(ingredients => this.setState({ ingredients }))
            .catch(error => this.setState({ error }));
    }

    purchasaHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.setState({ loading: true });

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Human bean',
                address: {
                    street: 'test street',
                    zipCode: '27170000',
                    country: 'NoWhere'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };

        //axios.post('/orders.json', order)
        axios.post('/posts', order)
            .then(resp => {
                console.log(resp);
            }).finally(() => {
                this.setState({ loading: false, purchasing: false });
            }).catch(err => console.log);
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

        let burger = <Spinner />;
        let orderSumary = null;

        if (this.state.ingredients) {
            burger = (
                <Aux>
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

            orderSumary = <OrderSumary
                ingredients={this.state.ingredients} 
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                price={this.state.totalPrice} />;
        } else if (this.state.error) {
            burger = <h1 style={{textAlign: 'center'}}>Ingredients could not be loaded!</h1>;
        }

        if (this.state.loading) {
            orderSumary = <Spinner />;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.pushchaseCancelHandler}>
                    {orderSumary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);