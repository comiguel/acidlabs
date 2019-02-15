import React from 'React';
import io from 'socket.io-client';
import config from '../../config';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { forecast: {} };
	}

	componentWillMount() {
    this.socket = io(`http://localhost:${config.port}`);
    this.socket.on('updatedForecast', (forecast) => {
    	console.log(forecast);
      this.updateForecast(forecast);
    })
  }

  updateForecast(forecast) {
  	this.setState({ forecast })
  }

  render() {
  	return <pre>{JSON.stringify(this.state.forecast)}</pre>
  }
}