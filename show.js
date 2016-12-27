import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import fs from 'fs'

// Inter-window Communication
const ipc = require('electron').ipcRenderer

var cancelButton = document.getElementById("cancel-action");
cancelButton.addEventListener("click", function() {
    ipc.send('cancel-action');
}, false)

// React Component

class CheckViewContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idNum: '',
            amountNum: ''
        };

        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        ipc.on('scannedId', (function(event,data) {
          console.log('received', data);
          this.setState({
            idNum: data['id'],
            amountNum: data['amount']
          });
          // Perform image finding inside this
        }).bind(this));

    }

    render() {
        return (
            <div>
                <h3>ID: {this.state.idNum}</h3>
                <h3>Amount: ${this.state.amountNum}</h3>
            </div>
        );
    }
}

class CheckView extends React.Component{
  render(){
    return(<CheckViewContainer/>);
  }
}

ReactDOM.render(
    <CheckView/>, document.getElementById('show-app'));
