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
          amount: '',
          clubName: 'Need a club name'
      };

      this.handleIDChange = this.handleIDChange.bind(this);
      this.handleAmountChange = this.handleAmountChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.handleChangeName = this.handleChangeName.bind(this);
  }

  componentDidMount(){
    ipc.on('setClubName', (function(event,data) {
      console.log('setting club name', data);
      this.setState({clubName: data});
    }).bind(this));
    ipc.on('clear', (function(event) {
      console.log('reset');
      this.setState({
        id: '',
        amount: ''
      });
    }).bind(this));
  }

  handleChangeName() {
    var currentName = this.state.clubName;
    ipc.send('setClubName-toggle', currentName);
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
      console.log('ID Scanned: ' + this.state.id + "\nCharging student $" + this.state.amount + " for club: "+ this.state.clubName);
      var scannedId = this.state.id;
      var chargeAmount = this.state.amount;
      var clubName = this.state.clubName
      var dataDict = {id: scannedId, amount: chargeAmount, club: clubName};
      ipc.send('scannedId', dataDict);
  }

  render() {
    var reg = new RegExp('^[0-9]{7}$');
      return (
        <div>
          <h1>Bake Sale: {this.state.clubName}</h1>
          <button onClick={this.handleChangeName}>Change</button>
          <br />
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
            {reg.test(this.state.id) && this.state.amount != '' && this.state.clubName != 'Need a club name' ? (<button type="submit">Submit</button>):(<button type="submit" disabled>Submit</button>)}
          </form>
        </div>
      );
  }
}

ReactDOM.render(
    <App/>, document.getElementById('app'))
