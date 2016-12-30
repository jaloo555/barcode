import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Button, TextInput} from 'react-desktop/windows'
import fs from 'fs'

// Necessary for creating pop-up window
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
const app = require('electron').remote
const dialog = app.dialog

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

    componentDidMount() {
        ipc.on('setClubName', (function(event, data) {
            console.log('setting club name', data);
            this.setState({clubName: data});
        }).bind(this));
        ipc.on('clear', (function(event) {
            console.log('reset');
            this.setState({id: '', amount: ''});
        }).bind(this));
    }

    handleChangeName() {
        var currentName = this.state.clubName;
        ipc.send('setClubName-toggle', currentName);
    }

    handleIDChange(event) {
        this.setState({id: event.target.value});
        console.log('student ID '+event.target.value);
    }

    handleAmountChange(event) {
        this.setState({amount: event.target.value});
        // console.log('Charging ' + event.target.value);
    }

    handleSubmit(event) {
        // TODO: use regex to check if it is a valid id number
        event.preventDefault();
        console.log('ID Scanned: ' + this.state.id + "\nCharging student $" + this.state.amount + " for club: " + this.state.clubName);
        var scannedId = this.state.id;
        var chargeAmount = this.state.amount;
        var clubName = this.state.clubName
        var dataDict = {
            id: scannedId,
            amount: chargeAmount,
            club: clubName
        };
        ipc.send('scannedId', dataDict);
    }

    render() {
        var reg = new RegExp('^[0-9]{7}$');
        return (
            <div className="formDiv">
                <h1 className="header">Bake Sale</h1>
                <h1 className="header">{this.state.clubName}</h1>
                <form onSubmit={this.handleSubmit} className="formDiv">
                    <label>
                        {/*<TextInput
                            theme='light'
                            color='#cc7f29'
                            label="Enter Student ID: "
                            placeholder="Scan Student ID"
                            type="text"
                            value={this.state.id}
                            onChange={this.handleIDChange}
                          />
                          <TextInput
                              theme='light'
                              color='#cc7f29'
                              label="Enter amount of item: "
                              placeholder="Amount"
                              type="text"
                              value={this.state.amount}
                              onChange={this.handleAmountChange}
                            />*/}
                          <input type="text" value={this.state.id} onChange={this.handleIDChange} placeholder="Scan Student ID" className="textInput"/>
                          <br />
                          <input type="text" value={this.state.amount} onChange={this.handleAmountChange} placeholder="Amount" className="textInput"/>
                          <br />
                    </label>
                    {reg.test(this.state.id) && this.state.amount != '' && this.state.clubName != 'Need a club name'
                        ? (
                            <Button type="submit" className="submitBtn">Submit</Button>
                        )
                        : (
                            <Button type="submit" className="submitBtn" disabled>Submit</Button>
                        )}
                </form>
                <span className="optionSpan">
                  <Button onClick={this.handleChangeName} className="changeBtn">Change Club</Button>
                  <ExportToCSVOptions/>
                </span>
            </div>
        );
    }
}

class ExportToCSVOptions extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
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

    handleClick() {
        ipc.send('export-request');
    }

    render() {
        return (
            <div>
                <Button className="exportBtn" onClick={this.handleClick}>Export</Button>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app'))
