import React from 'react';
import qwest from 'qwest';
import * as Store from '../store';
import {
	managerAddSite,
	managerStopSite,
	managerStartSite,
	managerRemoveSite,
	svgPath,
	openTab } from '../helpers';
import { PowerIcon, LoopIcon, StopIcon, PauseIcon } from './Icons';
import VhostLinks from './VhostLinks';

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

	siteNames() {
		var baseName = this.props.site.name;
		let names = [baseName];
		if (this.props.site.aliases != '') {
			this.props.site.aliases.split(',').forEach(alias => {
				names.push(alias.replace(/\s/g, '') + '.' + baseName);
			});
		}
		return names;
	}

	siteAliases() {
		var baseName = this.props.site.name;
		let aliases = [];
		if (this.props.site.aliases != '') {
			this.props.site.aliases.split(',').forEach(alias => {
				aliases.push(alias.replace(/\s/g, '') + '.' + baseName);
			});
		}
		return aliases;
	}

	siteUrl() {
		return 'http://' + this.siteName() + ':8080';
	}

	siteLinks() {
		return (
			<span className="Vhost-siteLinks">
				<a className="Vhost-name" onClick={this.launchSite.bind(this, this.props.site.name)}>{this.props.site.name}</a>
				<span className="Vhost-aliases">
					{this.siteAliases().map(url => <a key={url} className="Vhost-name" onClick={this.launchSite.bind(this, url)}>{url}</a>)}
				</span>
			</span>
		)
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
				<VhostLinks site={site} active={this.state.active} />
				<span className="Vhost-actions">
					{this.state.active || <button className="IconButton Vhost-actions-start" onClick={this.handleStart.bind(this)} title="Start">
						<PowerIcon />
					</button> }
					{this.state.active && <button className="IconButton Vhost-actions-restart" onClick={this.handleRestart.bind(this)} title="Restart">
						<LoopIcon />
					</button> }
					{this.state.active && <button className="IconButton Vhost-actions-stop" onClick={this.handleStop.bind(this)} title="Stop">
						<StopIcon />
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

	
}

export default Vhost;
