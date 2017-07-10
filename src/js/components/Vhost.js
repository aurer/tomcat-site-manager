import React from 'react';
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
					{this.state.active && <button className="IconButton Vhost-actions-stop" onClick={this.handleRemove.bind(this)} title="Stop">
						<StopIcon />
					</button> }
				</span>
			</div>
		)
	}

	handleStart() {
		this.setState({fetching: true, action: 'start'})
		managerAddSite(this.props.site, window.csrfToken)
			.then(res => res.text()).then(body => {
				this.props.onChange({
					type: 'start',
					site: this.props.site,
					response: body
				});
			}).catch(error => {
				this.setState({fetching: false, action: null});
				notify(`Failed to add '${this.props.site.name}'`, 'negative');
			});
	}

	handleRestart() {
		this.setState({fetching: true, action: 'restart'})

		managerStopSite(this.siteName(), window.csrfToken)
			.then(stopRes => {
				managerStartSite(this.siteName(), window.csrfToken)
				.then(res => res.text())
				.then(body => {
					this.props.onChange({
						type: 'restart',
						site: this.props.site,
						response: body
					});
				}).catch(error => {
					this.setState({fetching: false, action: null});
					notify(`Failed to start '${this.props.site.name}'`)
				})
			}).catch(error => {
				this.setState({fetching: false, action: null});
				notify(`Failed to stop '${this.props.site.name}'`)
			});
	}

	handleRemove() {
		this.setState({fetching: true, action: 'stop'})
		managerRemoveSite(this.siteName(), window.csrfToken)
			.then(res => res.text()).then(body => {
				this.props.onChange({
					type: 'stop',
					site: this.props.site,
					response: body
				});
			}).catch(error => {
				this.setState({fetching: false, action: null});
				notify(`Failed to stop '${this.props.site.name}'`, 'negative');
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
		this.setState({active: isActive});
	}
}

export default Vhost;
