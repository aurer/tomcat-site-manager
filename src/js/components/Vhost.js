import React from 'react';
import qwest from 'qwest';
import { managerAddSite, managerStopSite, managerStartSite, managerRemoveSite } from '../helpers';

class Vhost extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			fetching: false,
			action: null,
			csrfToken: this.props.csrfToken
		};
	}

	siteUrl() {
		return 'http://' + this.props.site.name + '.' + this.props.settings.domain;
	}

	componentWillReceiveProps(nextProps) {
		this.props = nextProps;
		this.checkSiteInManager();
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
		this.setState({fetching: true, action: 'start'})
		managerAddSite(this.props.site, this.props.csrfToken)
		.then((xhr, res) => {
			this.props.onChange({
				type: 'start',
				site: this.props.site,
				response: res
			});
		})
		.catch((error, xhr) => {
			console.error(error, xhr);
			this.setState({fetching: false, action: null});
		});
	}

	handleRestart() {
		this.setState({fetching: true, action: 'restart'})

		managerStopSite(this.props.site.name, this.props.csrfToken)
		.then((xhr, res) => {
			managerStartSite(this.props.site.name, this.props.csrfToken)
			.then((xhr, res) => {
				this.props.onChange({
					type: 'restart',
					site: this.props.site,
					response: res
				});
			});
		})
		.catch((error, xhr) => {
			console.error(error, xhr);
			this.setState({fetching: false, action: null});
		});
	}

	handleStop() {
		this.setState({fetching: true, action: 'stop'})

		managerRemoveSite(this.props.site.name, this.props.csrfToken)
		.then((xhr, res) => {
			this.props.onChange({
				type: 'stop',
				site: this.props.site,
				response: res
			});
		})
		.catch((error, xhr) => {
			console.error(error, xhr);
			this.setState({fetching: false, action: null});
		});
	}

	checkSiteInManager() {
		this.setState({fetching: false, action: null});
		var isActive = false;
		this.props.managerSites.forEach(site => {
			if (site.name == this.props.site.name) {
				return isActive = true;
			}
		});
		this.setState({active: isActive})
	}

	checkSiteStatus() {
		let url = this.siteUrl();
		this.setState({fetching: true});
		qwest.get(url)
		.then((xhr, res) => {
			this.setState({active: true, fetching: false});
		})
		.catch((error, xhr) => {
			console.error(error, xhr);
			this.setState({fetching: false});
		})
	}
}

export default Vhost;
