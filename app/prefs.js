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
    componentDidMount() {}
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
    constructor(props) {
        super(props);
        this.handleClr = this.handleClr.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.handleVoid = this.handleVoid.bind(this);
        this.handleCheckDB = this.handleCheckDB.bind(this);
    }

    componentDidMount() {
      ipc.on('studentsCount', (function(event, data) {
          alert('Number of students in database: ' +  data);
      }).bind(this));
        ipc.on('cleared', (function(event, data) {
            alert('Succesfully cleared all data!');
        }).bind(this));
        ipc.on('voided', (function(event, data) {
            alert('Succesfully voided last item!');
        }).bind(this));
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

    handleClr() {
        ipc.send('clearAllData');
    }
    handleExport() {
        ipc.send('export-request-admin');
    }
    handleVoid() {
        ipc.send('voidLastItem');
    }
    handleCheckDB() {
      ipc.send('checkDB');
    }
    handleStudentDB() {
        dialog.showOpenDialog(function (fileNames){
          if(fileNames === undefined){
            alert('No file selected');
          }
          else {
            fs.readFile(fileNames[0], 'utf-8', function(err,data) {
              if(err){
                alert("An error ocurred reading the file :" + err.message);
                return;
              }
              // Change how to handle the file content
              console.log("The file content is : " + data);
              ipc.send('updateStudentDB', data);
            });
          }
        });
    }

    render() {
        return (
            <div>
                <Button onClick={this.handleClr} className="btns">Clear all data</Button>
                <br/>
                <Button onClick={this.handleExport} className="btns">Export data</Button>
                <br/>
                <Button onClick={this.handleVoid} className="btns">Void last item</Button>
                <br/>
                <Button onClick={this.handleStudentDB} className="btns">Update student database</Button>
                <br/>
                <Button onClick={this.handleCheckDB} className="btns">Check student database</Button>
                <br/>
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

    handleBack() {
        ipc.send('settings-toggle');
        this.setState({password: ''});
    }

    render() {
        return (
            <div>
                <input type="password" className="textInput" value={this.state.password} onChange={this.handleChange} placeholder="Enter password"/> {this.state.password == 'drbrown'
                    ? (
                        <div>
                            <Settings/>
                        </div>
                    )
                    : (
                        <div></div>
                    )}
                <Button className="btns" onClick={this.handleBack}>Back</Button>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app'))
