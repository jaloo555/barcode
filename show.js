import React, {Component} from 'react'
import ReactDOM from 'react-dom'

// Inter-window Communication
const ipc = require('electron').ipcRenderer

ipc.on('scannedId', function(event,data){
  console.log('received',data['amount']);
  // this.state.id = data['id'];
  // this.state.amount = data['amount'];
});

var receivedData;

class validifyContainer extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
        id: '',
        amount: ''
    };

    this.componentDidMount = this.componentDidMount.bind(this)
  }

  // componentDidMount(){
  //   ipc.on('scannedId', function(event,data){
  //     console.log('received',data['amount']);
  //     this.state.id = data['id'];
  //     this.state.amount = data['amount'];
  //   });
  //
  //   console.log(triggered);
  // }

  render() {
    return (
      <div>
        <h1>ID:</h1>
        <break/>
        <h1>Amount:</h1>
      </div>
    );
  }
}

var cancelButton  = document.getElementById("cancel-action");
cancelButton.addEventListener("click", function() {
  ipc.send('cancel-action');
},false)

ReactDOM.render(
    <validifyContainer />, document.getElementById('show-app'))
