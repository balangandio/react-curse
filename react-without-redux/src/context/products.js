import React, { useState } from 'react';

const ProductsContext = React.createContext({
    products: [],
    toggleFavorite: () => {}
});

export default props => {
    const [ productsList, setProductsList ] = useState([
        {
            id: 'p1',
            title: 'Red Scarf',
            description: 'A pretty red scarf.',
            isFavorite: false
        },
        {
            id: 'p2',
            title: 'Blue T-Shirt',
            description: 'A pretty blue t-shirt.',
            isFavorite: false
        },
        {
            id: 'p3',
            title: 'Green Trousers',
            description: 'A pair of lightly green trousers.',
            isFavorite: false
        },
        {
            id: 'p4',
            title: 'Orange Hat',
            description: 'Street style! An orange hat.',
            isFavorite: false
        }
    ]);

    const toggleFavorite = productId => {
        setProductsList(current => {
            const prodIndex = current.findIndex(
                p => p.id === productId
            );
            const newFavStatus = !current[prodIndex].isFavorite;
            const updatedProducts = [...current];
            updatedProducts[prodIndex] = {
                ...current[prodIndex],
                isFavorite: newFavStatus
            };
            return updatedProducts; 
        });
    };

    return (
        <ProductsContext.Provider value={{ products: productsList, toggleFavorite }}>
            { props.children }
        </ProductsContext.Provider>
    )
};