import React from 'react';
import io from 'socket.io-client';
import config from '../../config';

import City from './City';

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

  createCities() {
  	const cities = [];

  	for (let city in this.state.forecast) {
			cities.push(<City
							name={city}
							date={this.state.forecast[city].date}
							hour={this.state.forecast[city].hour}
							temperature={this.state.forecast[city].temperature}
							summary={this.state.forecast[city].summary}
							icon={this.state.forecast[city].icon}
						/>);
		}
		return cities;
  }

  updateForecast(forecast) {
  	this.setState({ forecast })
  }

  render() {
  	return <div className="row justify-content-around m-5">
  	{ this.createCities() }
  	</div>
  }
}