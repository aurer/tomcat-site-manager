import React from 'react';
import qwest from 'qwest';
import Isvg from 'react-inlinesvg';
import * as Store from '../store';
import {
	managerAddSite,
	managerStopSite,
	managerStartSite,
	managerRemoveSite,
	svgPath,
	openTab } from '../helpers';

class Vhost extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			fetching: false,
			action: null
		};
	}

	siteName() {
		return this.props.site.name + '.' + this.props.settings.domain;
	}

	siteUrl() {
		return 'http://' + this.siteName() + ':8080';
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
				{this.state.active && <a className="Vhost-name" onClick={this.launchSite.bind(this)}>{site.name}</a> }
				{this.state.active || <span className="Vhost-name">{site.name}</span> }

				<span className="Vhost-actions">
					{this.state.active || <button className="IconButton Vhost-actions-start" onClick={this.handleStart.bind(this)} title="Start">
						<Isvg src={svgPath('power.svg')} />
					</button> }
					{this.state.active && <button className="IconButton Vhost-actions-restart" onClick={this.handleRestart.bind(this)} title="Restart">
						<Isvg src={svgPath('loop.svg')} />
					</button> }
					{this.state.active && <button className="IconButton Vhost-actions-stop" onClick={this.handleStop.bind(this)} title="Stop">
						<Isvg src={svgPath('stop.svg')} />
					</button> }
				</span>
			</div>
		)
	}

	handleStart() {
		this.setState({fetching: true, action: 'start'})
		managerAddSite(this.props.site, window.csrfToken)
			.then((xhr, res) => {
				this.props.onChange({
					type: 'start',
					site: this.props.site,
					response: res
				});
			})
			.catch((error, xhr) => {
				console.error(error, xhr);
				this.props.onError(`Failed to add '${this.props.site.name}'`);
				this.setState({fetching: false, action: null});
			});
	}

	handleRestart() {
		this.setState({fetching: true, action: 'restart'})

		managerStopSite(this.siteName(), window.csrfToken)
			.then((xhr, res) => {
				managerStartSite(this.siteName(), window.csrfToken)
				.then((xhr, res) => {
					this.props.onChange({
						type: 'restart',
						site: this.props.site,
						response: res
					});
				})
				.catch((error, xhr) => {
					console.error(error, xhr);
					this.props.onError(`Failed to restart '${this.props.site.name}'`);
					this.setState({fetching: false, action: null});
				});
			})
			.catch((error, xhr) => {
				console.error(error, xhr);
				this.props.onError(`Failed to pause '${this.props.site.name}'`);
				this.setState({fetching: false, action: null});
			});
	}

	handleStop() {
		this.setState({fetching: true, action: 'stop'})
		managerRemoveSite(this.siteName(), window.csrfToken)
			.then((xhr, res) => {
				this.props.onChange({
					type: 'stop',
					site: this.props.site,
					response: res
				});
			})
			.catch((error, xhr) => {
				console.error(error, xhr);
				this.props.onError(`Failed to stop '${this.props.site.name}'`);
				this.setState({fetching: false, action: null});
			});
	}

	checkSiteInManager() {
		this.setState({fetching: false, action: null});
		var isActive = false;
		var siteName = this.siteName();
		this.props.managerSites.forEach(site => {
			if (site.name == siteName) {
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

	launchSite() {
		openTab(this.siteUrl());
	}
}

export default Vhost;
