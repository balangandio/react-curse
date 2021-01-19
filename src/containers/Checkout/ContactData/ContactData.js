import React, { Component } from "react";

import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        }
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.totalPrice,
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
                this.props.history.push('/');
            }).finally(() => {
                this.setState({ loading: false });
            }).catch(err => console.log);
    }

    render() {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Mail" />
                <input className={classes.Input} type="text" name="street" placeholder="Street Name" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>Order</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;