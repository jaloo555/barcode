import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Button, TextInput} from 'react-desktop/windows'

// Inter-window Communication
const ipc = require('electron').ipcRenderer

// React Component

class CheckViewContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idNum: '',
            amountNum: '',
            imgSrc: '',
            clubName: ''
        };

        this.componentDidMount = this.componentDidMount.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
    }

    componentDidMount() {
        ipc.on('scannedId', (function(event,data) {
          console.log('received', data);
          this.setState({
            idNum: data['id'],
            amountNum: data['amount'],
            imgSrc: ('../../idImages/'+ data['id'] + '.jpg'),
            clubName: data['club']
          });
          // Perform image finding inside this
        }).bind(this));

    }

    handleConfirm() {
      var scannedId = this.state.idNum;
      var chargeAmount = this.state.amountNum;
      var clubName = this.state.clubName
      var dataDict = {id: scannedId, amount: chargeAmount, club: clubName};
      ipc.send('saveToDB', dataDict);
    }

    handleCancel() {
      ipc.send('cancel-action');
    }

    render() {
        return (
            <div>
                <h3 className="header">ID: {this.state.idNum}</h3>
                <h3 className="header">Amount: ${this.state.amountNum}</h3>
                <h3 className="header">Charged to: {this.state.clubName}</h3>
                <div className="imageContainer">
                  <h3 className="idHeader">ID Image: </h3><img src={this.state.imgSrc} className="idImage"/>
                </div>
                <div className="btnWrap">
                  <Button className="btns" onClick={this.handleCancel}>Cancel</Button>
                  {this.state.idNum != '' && this.state.amountNum != '' && this.state.clubName != '' ?(<Button className="btns" onClick={this.handleConfirm}>Confirm</Button>):(<Button className="btns" onClick={this.handleConfirm} disabled>Submit</Button>)}
                </div>
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
