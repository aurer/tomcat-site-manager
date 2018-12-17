import React from 'react';
import { LoadingRing } from './Icons';

class LoadingScreen extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		let spin = [
			{transform: 'rotate(0)', transformOrigin: '60px 60px'},
			{transform: 'rotate(360deg)', transformOrigin: '60px 60px'}
		];

		let loadingBar = document.querySelector(".Loading svg #loading-bar");
		let loadingCircle = document.querySelector(".Loading svg #loading-circle");

		if (loadingBar && loadingCircle) {
			loadingBar.animate(
			  spin, { duration: 500, iterations: Infinity }
			);
			loadingCircle.animate(
			  spin, { duration: 600, iterations: Infinity }
			);
		}
	}

	render() {
		var message = '';
		switch (this.props.action) {
			case 'start':
				message = 'Starting ' + this.props.site.name
				break;
			case 'stop':
				message = 'Stopping ' + this.props.site.name
				break;
			case 'restart':
				message = 'Restarting ' + this.props.site.name
				break;
			default:
				message = 'Loading'
				break;
		}

		return (
			<div className="Loading">
				<span>
					<p>{message}</p>
					<LoadingRing />
				</span>
			</div>
		)
	}
}


export default LoadingScreen;