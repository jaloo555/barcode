import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  render () {
    return (
			<form className="form" onSubmit={this.handleSubmit}>
                <input onChange= {this.handleChange} />
                <button>Submit</button>
			</form>
		);
 	}

    handleSubmit(){
        console.log('submit');
    }
    handleChange(e){
        console.log('this changed: ' + e.target.value);
    }
}


ReactDOM.render(<App/>,document.getElementById('app'))
