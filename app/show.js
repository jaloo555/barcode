import React, {Component} from 'react'
import ReactDOM from 'react-dom'

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
                <h3>ID: {this.state.idNum}</h3>
                <h3>Amount: ${this.state.amountNum}</h3>
                <h3>Charged to: {this.state.clubName}</h3>
                <div className="imageContainer">
                  <img src={this.state.imgSrc} className="idImage"/>
                </div>
                <button onClick={this.handleCancel}>Cancel</button>
                {this.state.idNum != '' && this.state.amountNum != '' && this.state.clubName != '' ?(<button onClick={this.handleConfirm}>Confirm</button>):(<button onClick={this.handleConfirm} disabled>Submit</button>)}
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
