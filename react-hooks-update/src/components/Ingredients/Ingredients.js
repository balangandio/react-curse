import React, { useCallback, useReducer, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientsReducer = (current, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [ ...current, action.ingredient ];
    case 'DELETE':
      return current.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get threre!')
  }
}

function Ingredients() {
  const [ ingredients, dispatch ] = useReducer(ingredientsReducer, []);
  const { sendRequest, clear, ...loadState} = useHttp();

  const addIngredientHandler = useCallback(async ingr => {
    sendRequest(`https://jsonplaceholder.typicode.com/posts/${ingr.id}`, {
      method: 'PUT',
      body: JSON.stringify(ingr)
    });
  }, []);

  const removeIngredientHandler = useCallback(ingrId => {
    sendRequest(`https://jsonplaceholder.typicode.com/posts/${ingrId}`, {
      method: 'DELETE',
      reqExtra: ingrId
    });
  }, [sendRequest]);

  useEffect(() => {
    if (!loadState.isLoading && !loadState.error) {
      const { identifier, extra } = loadState;

      if (identifier === 'REMOVE_INGREDIENT') {
        dispatch({ type: 'DELETE', id: extra });
      } else if (identifier === 'ADD_INGREDIENT') {
        dispatch({ type: 'ADD', ingredient: extra });
      }
    }
  }, [loadState.data, loadState.extra, loadState.identifier]);

  const filteredIngredientsHandler = useCallback((ingrs) => {
    dispatch({ type: 'SET', ingredients: ingrs });
  }, []);

  const ingredientsList = useMemo(() => {
    return <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
  }, [ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      { loadState.error && (
        <ErrorModal onClose={clear}>{loadState.error}</ErrorModal>
      )}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={loadState.isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        { ingredientsList }
      </section>
    </div>
  );
}

export default Ingredients;
