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
        return (<IDForm/>);
    }
}

function newWindow() {
  const modalPath = path.join('file://', __dirname, './show.html')
      let win = new BrowserWindow({
          width: 400,
          height: 320
      })
      win.on('close', function() {
          win = null
      })
      win.loadURL(modalPath)
      win.openDevTools();
      win.show()
}

class IDForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          value: ''
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({value: event.target.value});
  }

  handleSubmit(event) {
      // TODO: use regex to check if it is a valid id number
      event.preventDefault();
      console.log('ID Scanned: ' + this.state.value);
      var scannedId = this.state.value;
      ipc.send('scannedId', scannedId);
      newWindow();
  }

  render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
              placeholder="Scan Student ID"/>
          </label>
          <button type="submit">Submit</button>
        </form>
      );
  }
}

ReactDOM.render(
    <App/>, document.getElementById('app'))
