import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import * as actions from '../../store/actions/index';

const Checkout = props => {

    const checkoutCancelledHandler = () => {
        props.history.goBack();
    }

    const checkoutContinueHandler = () => {
        props.history.replace('/checkout/contact-data');
    }

    if (!props.ingredients || props.purchased) {
        return (<Redirect to="/" />);
    }

    return (
        <div>
            <CheckoutSummary ingredients={props.ingredients}
                checkoutCancelled={checkoutCancelledHandler}
                checkoutContinued={checkoutContinueHandler} />

            <Route path={props.match.path + '/contact-data'}
                component={ContactData} />
        </div>
    );
}

const mapStateToProps = state => {
    return {
        ingredients: state.burger.ingredients,
        purchased: state.order.purchased
    }
};

const dispatchToProps = dispatch => {
    return {
        onInitPurchase: () => dispatch(actions.purchaseInit())
    }
};

export default connect(mapStateToProps, dispatchToProps)(Checkout);
