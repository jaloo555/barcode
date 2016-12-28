import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import fs from 'fs'

// Necessary for creating pop-up window
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

// Communication between 2 render processes
const ipc = require('electron').ipcRenderer

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
          <div>
            <IDForm/>
          </div>
      );
    }
}

class IDForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          id: '',
          amount: ''
      };

      this.handleIDChange = this.handleIDChange.bind(this);
      this.handleAmountChange = this.handleAmountChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleIDChange(event) {
      this.setState({id: event.target.value});
    // console.log('student ID '+event.target.value);
  }

  handleAmountChange(event) {
    this.setState({amount: event.target.value});
    // console.log('Charging ' + event.target.value);
  }

  handleSubmit(event) {
      // TODO: use regex to check if it is a valid id number
      event.preventDefault();
      console.log('ID Scanned: ' + this.state.id + "\nCharging student $" + this.state.amount);
      var scannedId = this.state.id;
      var chargeAmount = this.state.amount;
      var dataDict = {id: scannedId, amount: chargeAmount};
      ipc.send('scannedId', dataDict);
  }

  render() {
    var reg = new RegExp('^[0-9]{7}$');
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              value={this.state.id}
              onChange={this.handleIDChange}
              placeholder="Scan Student ID"
              />
            <input
              type="text"
              value={this.state.amount}
              onChange={this.handleAmountChange}
              placeholder="Amount"
              />
          </label>
          {reg.test(this.state.id) && this.state.amount != '' ? (<button type="submit">Submit</button>):(<button type="submit" disabled>Submit</button>)}
        </form>
      );
  }
}

ReactDOM.render(
    <App/>, document.getElementById('app'))
