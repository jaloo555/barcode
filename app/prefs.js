import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Button, TextInput} from 'react-desktop/windows'
import fs from 'fs'

// Necessary for creating pop-up window
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
const ipc = require('electron').ipcRenderer
const app = require('electron').remote
const dialog = app.dialog


class App extends React.Component {
  constructor(props) {
      super(props);
  }
  componentDidMount() {

  }
  render() {
      return (
          <div>
              <h1>Admin</h1>
              <Safety/>
          </div>
      );
  }
}

class Settings extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClr = this.handleClr.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  componentDidMount() {
      ipc.on('parsed-csv', (function(event, data) {
          console.log('Received csv file, now saving to file system', data);

          dialog.showSaveDialog({
              title: 'Save as CSV',
              defaultPath: '~/file.csv'
          }, function(fileName) {
              if (fileName === undefined) {
                  alert('File not saved!')
                  return
              }
              fs.writeFile(fileName, data, function(err) {
                  if (err) {
                      alert("An error ocurred creating the file: " + err.message)
                  } else {
                      alert("The file has been succesfully saved");
                  }
              })
          })
      }).bind(this));
  }

  handleChange(){
  }

  handleClr(){
  }

  handleExport() {
    ipc.send('export-request-admin');
  }

  render() {
    return (
      <div>
        <Button onClick={this.handleClr} className="btns">Clear all data</Button>
        <br/>
        <Button onClick={this.handleExport} className="btns">Export data</Button>
    </div>
    );
  }
}

class Safety extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        password: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleChange(event) {
    this.setState({password: event.target.value});
  }

  handleBack(){
    ipc.send('settings-toggle');
    this.setState({password: ''});
  }

  render() {
    return (
      <div>
        <input type="password" className="textInput" value={this.state.password} onChange={this.handleChange} placeholder="Enter password"/>
        {this.state.password == 'drbrown'
              ? (
                <div>
                  <Settings/>
                </div>
              )
              : (
                <div>
                </div>
              )}
              <Button className="btns" onClick={this.handleBack}>Back</Button>
      </div>
    );
  }
}


ReactDOM.render(
    <App/>, document.getElementById('app'))
