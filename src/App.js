import React, { Component } from 'react';
import Person from './Person/Person';
import './App.css';
import styled from 'styled-components';

const StyledH1 = styled.h1`
  color: ${props => props.alt.color}
`

class App extends Component {
  colors = ['black', 'blue', 'red', 'green'];

  state = {
    persons: [{ name: 'human', age: 42, year: 6354 }, 
      { name: 'unknown', age: 23, year: 734 },
      { name: 'loading', age: 462, year: 4332 }],
    visibility: true,
    currentColor: 0
  };

  toggleHandler = () => {
    this.setState({
      visibility: !this.state.visibility,
      currentColor: this.state.currentColor === this.colors.length - 1
        ? 0 : this.state.currentColor + 1
    });
  }

  render() {
    const persons = this.state.visibility 
      ? this.state.persons.map((p, i) => (<Person key={i} name={p.name} age={p.age} year={p.year} />))
      : null;

    const styleParams = {
      color: this.colors[this.state.currentColor]
    };

    return (
      <div className="App">
        <StyledH1 alt={styleParams}>Hello there!</StyledH1>
        <button onClick={this.toggleHandler}>Toggle</button>
        <p></p>
        { persons }
      </div>
    );
  }
}

export default App;
