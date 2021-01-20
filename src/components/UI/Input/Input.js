import React from 'react';

import classes from './Input.module.css';

const input = props => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    const classNameList = inputClasses.join(' ');

    switch (props.elementType) {
        case 'input':
            inputElement = <input className={classNameList}
                {...props.elementConfig} value={props.value}
                onChange={props.changed} />;
            break;
        case 'textarea':
            inputElement = <textarea className={classNameList}
                {...props.elementConfig} value={props.value}
                onChange={props.changed} />;
            break;
        case 'select':
            inputElement = (
                <select className={classNameList}
                    value={props.value}
                    onChange={props.changed}>
                    {
                        props.elementConfig.options.map(op => (
                            <option key={op.value} value={op.value}>{op.displayValue}</option>
                        ))
                    }
                </select>
            );
            break;
        default:
            inputElement = <input className={classNameList}
                {...props.elementConfig} value={props.value}
                onChange={props.changed} />;
    }

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            { inputElement }
        </div>
    );
};

export default input;