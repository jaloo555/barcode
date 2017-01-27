import React from 'react'
import ReactDOM from 'react-dom'
import {Button, TextInput} from 'react-desktop/windows'

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

    componentDidMount(){
      ipc.on('changeClubName', (function(event,data) {
        console.log('setting club name', data);
        this.setState({clubName: data});
      }).bind(this));
    }

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
      var reg = new RegExp('^(?!\s*$).+');
        return (
            <div className="formDiv" >
                <h1 className="header" >Welcome {this.state.clubName}</h1>
                <img src="../../Cranbrook.jpg"/>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <h2 className="header">Enter the name of the sale to begin:</h2>
                        <input type="text" className="textInput" value={this.state.clubName} onChange={this.handleChange} placeholder="Enter club name"/>
                    </label>
                    <br />
                    {reg.test(this.state.clubName) ? (<Button type="submit" className="submitBtn">Confirm</Button>):(<Button type="submit" className="submitBtn" disabled>Confirm</Button>)}
                </form>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>, document.getElementById('app'));
