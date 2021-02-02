import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    };
};

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    };
};

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients
    };
};

export const fetchIngredientsFail = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAIL
    };
};

export const initIngredients = () => {
    return dispatch => {
        axios.get('/posts')
            .then(resp => {
                return { salad: 0, bacon: 0, cheese: 0, meat: 0 };
            }).then(ingredients => dispatch(setIngredients(ingredients)))
            .catch(error => dispatch(fetchIngredientsFail()));
    };
};