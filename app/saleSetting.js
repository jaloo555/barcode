import React from 'react'
import ReactDOM from 'react-dom'

const ipc = require('electron').ipcRenderer

class App extends React.Component {
    constructor(props)
    {
        super(props);
    }
    render() {
        return (<NameBox/>);
    }
}

class NameBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clubName: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    // componentDidMount() {
    //     ipc.on('scannedId', (function(event,data) {
    //       console.log('received', data);
    //       this.setState({
    //         idNum: data['id'],
    //         amountNum: data['amount'],
    //         imgSrc: ('../../idImages/'+ data['id'] + '.jpg')
    //       });
    //       // Perform image finding inside this
    //     }).bind(this));
    //
    // }

    handleChange(event) {
        this.setState({clubName: event.target.value});
    }

    handleSubmit(event) {
        // TODO: use regex to check if it is a valid id number
        event.preventDefault();
        console.log(this.state.clubName);
        var clubName = this.state.clubName
        ipc.send('setClubName-toggle', clubName);
    }

    render() {
        return (
            <div>
                <h1>Welcome {this.state.clubName}</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <input type="text" value={this.state.clubName} onChange={this.handleChange} placeholder="Enter ClubName"/>
                    </label>
                    <button type="submit">Confirm</button>
                </form>
            </div>
        );
    }
}
ReactDOM.render(
    <App/>, document.getElementById('app'));
