import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import fs from 'fs'

class App extends React.Component {
  constructor(props){
    super(props);
  }
  render () {
    return (
      <IDForm />
		);
 	}
}

class IDForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('ID Scanned: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder="Scan Student ID"
            />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}


ReactDOM.render(<App/>,document.getElementById('app'))
