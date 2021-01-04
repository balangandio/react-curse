import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledH1 = styled.h1`
  color: ${props => props.color};
  cursor: pointer;
`

const coloredTitle = (props) => {
    const titleRef = useRef(null);

    const color = props.color ? props.color : props.colors[0];

    const nextColor = () => {
        const current = props.colors.indexOf(color);

        let nextOne = Math.floor(Math.random() * props.colors.length);

        if (current === nextOne && props.colors.length > 1) {
            nextOne = nextOne === props.colors.length - 1 ? 0 : nextOne + 1;
        }

        return props.colors[nextOne];
    };

    useEffect(() => titleRef.current.click(), []);

    return (
        <StyledH1 ref={titleRef} color={color} onClick={e => props.colorChange(e, nextColor())}>{props.children}</StyledH1>
    );
};

export default React.memo(coloredTitle);