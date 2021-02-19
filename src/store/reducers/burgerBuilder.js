import * as actionTypes from '../actions/actionsTypes';
import { updateObject } from '../../shared/utility';

const initialPrice = 4;

const initialState = {
    ingredients: null,
    totalPrice: initialPrice,
    error: false,
    building: false
};

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

const updateStateIngredient = (amount, ingredientName, currentState) => {
    const updatedIngredient = { [ingredientName]: currentState.ingredients[ingredientName] + amount };
    const updatedIngredients = updateObject(currentState.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: currentState.totalPrice + (amount < 0 
            ? INGREDIENT_PRICES[ingredientName] * (-1)
            : INGREDIENT_PRICES[ingredientName]),
        building: true
    };
    return updateObject(currentState, updatedState);
};

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.ADD_INGREDIENT:
            return updateStateIngredient(1, action.ingredientName, state);
        case actionTypes.REMOVE_INGREDIENT:
            return updateStateIngredient(-1, action.ingredientName, state);
        case actionTypes.SET_INGREDIENTS:
            return updateObject(state, {
                ingredients: action.ingredients,
                totalPrice: initialPrice,
                error: false,
                building: false
            });
        case actionTypes.FETCH_INGREDIENTS_FAIL:
            return updateObject(state, { error: true });
        default:
            return state;
    }
};

export default reducer;