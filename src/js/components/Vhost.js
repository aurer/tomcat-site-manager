import React from 'react';

class Vhost extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			fetching: false,
			site: this.props.site
		};
	}

	render() {
		let site = this.props.site;
		let index = this.props.index;
		let className = "Vhost";
		className += (this.state.fetching) ? ' is-fetching' : (this.state.active) ? ' is-active' : '';

		switch (this.state.action) {
			case 'start':
				className += ' is-starting';
			break;
			case 'restart':
				className += ' is-restarting';
			break;
			case 'stop':
				className += ' is-stopping';
			break;
		}

		return (
			<div className={className}>
				<i className="Vhost-indicator"></i>
				<span className="Vhost-name">{site.name}</span>
				<span className="Vhost-actions">
					{this.state.active || <button className="IconButton Vhost-actions-start" onClick={this.handleStart.bind(this)}>Start</button> }
					{this.state.active && <button className="IconButton Vhost-actions-restart" onClick={this.handleRestart.bind(this)}>Restart</button> }
					{this.state.active && <button className="IconButton Vhost-actions-stop" onClick={this.handleStop.bind(this)}>Stop</button> }
				</span>
			</div>
		)
	}

	handleStart() {
		let self = this;
		this.setState({fetching: true, action: 'start'})
		setTimeout(function() {
			self.setState({fetching: false, active: true, action: null});
			let action = {
				type: 'start',
				data: self.state
			}
			self.props.onChange(action);
		}, 2000);
	}

	handleRestart() {
		let self = this;
		this.setState({fetching: true, action: 'restart'})
		setTimeout(function() {
			self.setState({fetching: false, action: null});
			let action = {
				type: 'restart',
				data: self.state
			}
			self.props.onChange(action);
		}, 2000);
	}

	handleStop() {
		let self = this;
		this.setState({fetching: true, action: 'stop'})
		setTimeout(function() {
			self.setState({fetching: false, active: false, action: null});
			let action = {
				type: 'stop',
				data: self.state
			}
			self.props.onChange(action);
		}, 2000);
	}
}

export default Vhost;
