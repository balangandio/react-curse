import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../axios-orders';
import classes from './Orders.module.css';
import Order from '../../components/Order/Order';
import * as actions from '../../store/actions/index';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {

    componentDidMount() {
        this.props.onFetchOrders(this.props.token);
    }

    render() {
        return (
            <div className={classes.Orders}>
                {
                    this.props.loading
                        ? <Spinner />
                        : this.props.orders.map(order => (
                            <Order key={order.id} price={order.price} ingredients={order.ingredients} />
                        ))
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const dispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    };
};

export default connect(mapStateToProps, dispatchToProps)(withErrorHandler(Orders, axios));