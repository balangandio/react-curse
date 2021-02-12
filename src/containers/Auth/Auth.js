import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        isSignup: false,
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'E-mail address'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 1
                },
                valid: false,
                touched: false
            }
        }
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authPath !== '/') {
            this.props.setAuthRedirectPathToHome();
        }
    }

    inputChangedHandler = (event, controlName) => {
        const value = event.target.value;

        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value,
                valid: this.checkValidity(
                    value,
                    this.state.controls[controlName].validation
                ),
                touched: true
            }
        };

        this.setState({ controls: updatedControls });
    }

    checkValidity(value, rules) {
        let isValid = true;
        value = value.trim();

        if (rules.required) {
            isValid = value !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        return isValid;
    }

    onSubmitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(
            this.state.controls.email.value,
            this.state.controls.password.value,
            this.state.controls.isSignup
        );
    }

    switchAuthModeHandler = () => {
        this.setState(prev => {
            return { isSignup: !prev.isSignup };
        })
    }

    render() {
        if (this.props.isAuthenticated) {
            return (<Redirect to={this.props.authPath} />);
        }

        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            })
        }

        let form = formElementsArray.map(formElement => (
            <Input key={formElement.id}
                elementType={formElement.config.elementType}
                elementConfig={formElement.config.elementConfig}
                value={formElement.config.value}
                changed={(evt) => this.inputChangedHandler(evt, formElement.id)}
                invalid={!formElement.config.valid}
                shouldValidate={formElement.config.validation}
                touched={formElement.config.touched} />
        ));

        const hasAnyInvalidField = formElementsArray
            .filter(elem => !elem.config.valid).length > 0;

        const signText = (isSignup) => isSignup ? 'SIGNUP' : 'SIGNIN';

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMsg = null;

        if (this.props.error) {
            errorMsg = <p>An error occurred - {this.props.error}</p>;
        }

        return (
            <div className={classes.Auth}>
                {errorMsg}
                <form onSubmit={this.onSubmitHandler}>
                    { form }
                    <Button btnType="Success" disabled={hasAnyInvalidField}>
                        {signText(this.state.isSignup)}
                    </Button>
                </form>
                <Button btnType="Danger"
                    clicked={this.switchAuthModeHandler}>
                    SWITH TO {signText(!this.state.isSignup)}
                </Button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burger.building,
        authPath: state.auth.authRedirectPath
    };
};

const dispatchToProps = dispatch => {
    return {
        onAuth: (email, pass, isSignup) => dispatch(actions.auth(email, pass, isSignup)),
        setAuthRedirectPathToHome: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, dispatchToProps)(Auth);