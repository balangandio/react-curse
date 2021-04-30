import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObject } from '../../shared/utility';
import { checkValidity } from '../../shared/validation';

const Auth = props => {
    const [ authForm, setAuthForm ] = useState({
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
    });
    const [ isSignup, setIsSignup ] = useState(true);
    const { buildingBurger, authPath, setAuthRedirectPathToHome } = props;

    useEffect(() => {
        if (!buildingBurger && authPath !== '/') {
            setAuthRedirectPathToHome();
        }
    }, [buildingBurger, authPath, setAuthRedirectPathToHome]);

    const inputChangedHandler = (event, controlName) => {
        const value = event.target.value;

        const updatedControls = updateObject(
            authForm,
            {
                [controlName]: {
                    ...authForm[controlName],
                    value,
                    valid: checkValidity(
                        value,
                        authForm[controlName].validation
                    ),
                    touched: true
                }
            }
        );

        setAuthForm(updatedControls);
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        props.onAuth(
            authForm.email.value,
            authForm.password.value,
            authForm.isSignup
        );
    };

    const switchAuthModeHandler = () => {
        setIsSignup(prev => !prev);
    };

    if (props.isAuthenticated) {
        return (<Redirect to={props.authPath} />);
    }

    const formElementsArray = [];
    for (let key in authForm) {
        formElementsArray.push({
            id: key,
            config: authForm[key]
        })
    }

    let form = formElementsArray.map(formElement => (
        <Input key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(evt) => inputChangedHandler(evt, formElement.id)}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched} />
    ));

    const hasAnyInvalidField = formElementsArray
        .filter(elem => !elem.config.valid).length > 0;

    const signText = (isSignup) => isSignup ? 'SIGNUP' : 'SIGNIN';

    if (props.loading) {
        form = <Spinner />;
    }

    let errorMsg = null;

    if (props.error) {
        errorMsg = <p>An error occurred - {props.error}</p>;
    }

    return (
        <div className={classes.Auth}>
            {errorMsg}
            <form onSubmit={onSubmitHandler}>
                { form }
                <Button btnType="Success" disabled={hasAnyInvalidField}>
                    {signText(isSignup)}
                </Button>
            </form>
            <Button btnType="Danger"
                clicked={switchAuthModeHandler}>
                SWITH TO {signText(!isSignup)}
            </Button>
        </div>
    );
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