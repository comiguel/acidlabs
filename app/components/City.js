import React from 'react';
import styles from './City.css';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle } from 'reactstrap';
const Skycons = require('skycons')(window);

export default class City extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (this.props.icon) {
			const skycons = new Skycons({ color: "#0e2a8e" });
			skycons.add(this.props.name, this.props.icon);
			skycons.play();
		}
	}

	componentDidUpdate() {
		if (this.props.icon) {
			const skycons = new Skycons({ color: "#0e2a8e" });
			skycons.set(this.props.name, this.props.icon);
			skycons.play();
		}
	}

	render() {
		return (
			<div className="col col-md-4 col-sm-2 p-2">
				<Card>
					<canvas id={this.props.name} width="auto" height="auto"></canvas>
					<CardBody>
						<h2>{this.props.name}</h2>
						<h4>{this.props.temperature}</h4>
						<CardText>
							<h5>{this.props.summary}</h5>
							<strong>{this.props.date}</strong><br />
							<strong>{this.props.hour}</strong>
						</CardText>
					</CardBody>
				</Card>
			</div>
		)
	}
}

City.defaultProps = {
  temperature: 'Cargando...',
  summary: 'Cargando...',
  date: 'Cargando...',
  hour: 'Cargando...',
};