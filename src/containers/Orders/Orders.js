import React, { Component } from 'react';

import axios from '../../axios-orders';
//import classes from './Orders.module.css';
import Order from '../../components/Order/Order';

class Orders extends Component {
    state = {
        orders: [],
        loading: true
    };

    componentDidMount() {
        axios.get('/posts')
            .then(resp => {
                return [
                    { id: 1, price: 23, ingredients: {bacon: 6, cheese: 2, meat: 0, salad: 2}, deliveryMethod: 'fastest' },
                    { id: 2, price: 42, ingredients: {bacon: 0, cheese: 2, meat: 0, salad: 2}, deliveryMethod: 'fastest' },
                    { id: 3, price: 1.42, ingredients: {bacon: 1, cheese: 4, meat: 0, salad: 2}, deliveryMethod: 'fastest' }
                ];
            }).then(orders => this.setState({ orders }))
            .catch(error => this.setState({ error }))
            .finally(() => {
                this.setState({ loading: false });
            });
    }

    render() {
        
        return (
            <div>
                {
                    this.state.orders.map(order => (
                        <Order key={order.id} price={order.price} ingredients={order.ingredients} />
                    ))
                }
            </div>
        );
    }
}

export default Orders;