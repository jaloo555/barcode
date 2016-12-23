import React, {Component} from 'react'
import ReactDOM from 'react-dom'
//import { Box, Text } from 'react-desktop/macOs';
import AppContainer from './appcontainer'

class App extends React.Component {
  render () {
    return (
			<AppContainer />
		)
 	}
}


ReactDOM.render(<App/>,document.getElementById('app'))