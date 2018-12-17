import React from 'react';
import * as Store from '../store';
import { managerAddSite,	managerStopSite, managerStartSite, managerRemoveSite, openTab } from '../helpers';
import { PowerIcon, LoopIcon, StopIcon, PauseIcon } from './Icons';
import VhostLinks from './VhostLinks';
import * as Stats from './Stats';

class Vhost extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			action: null
		};
	}

	siteName() {
		return this.props.site.name + '.' + this.props.settings.domain;
	}

	siteAliases() {
		var baseName = this.props.site.name;
		var aliases = [];
		if (this.props.site.aliases != '') {
			this.props.site.aliases.split(',').forEach(alias => {
				aliases.push(alias.replace(/\s/g, '') + '.' + baseName);
			});
		}
		return aliases;
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
		var site = this.props.site;
		var index = this.props.index;
		var className = "Vhost";

		className += (this.state.active) ? ' is-active' : '';

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
		this.setState({action: 'start'})
		this.props.onChange({
			type: 'load',
			site: this.props.site,
			action: 'start'
		});
		managerAddSite(this.props.site, window.csrfToken)
			.then(res => res.text()).then(body => {
				this.props.onChange({
					type: 'start',
					site: this.props.site,
					response: body
				});
			}).catch(error => {
				this.setState({action: null});
				notify(`Failed to add ${this.props.site.name}`, 'negative');
			});
	}

	handleRestart() {
		this.setState({action: 'restart'})
		this.props.onChange({
			type: 'load',
			site: this.props.site,
			action: 'restart'
		});
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
					this.setState({action: null});
					notify(`Failed to start ${this.props.site.name}`)
				})
			}).catch(error => {
				this.setState({action: null});
				notify(`Failed to stop ${this.props.site.name}`)
			});
	}

	handleStop() {
		this.setState({action: 'stop'})
		this.props.onChange({
			type: 'load',
			site: this.props.site,
			action: 'stop'
		});
		managerRemoveSite(this.siteName(), window.csrfToken)
			.then(res => res.text()).then(body => {
				this.props.onChange({
					type: 'stop',
					site: this.props.site,
					response: body
				});
			}).catch(error => {
				this.setState({action: null});
				notify(`Failed to stop ${this.props.site.name}`, 'negative');
			});
	}

	checkSiteInManager() {
		var isActive = false;
		var siteName = this.siteName();
		this.setState({action: null});
		this.props.managerSites.forEach(site => {
			if (site.name == siteName) {
				return isActive = true;
			}
		});
		this.setState({active: isActive});
		this.props.onChange({
			type: 'loadeStateChanged',
			site: this.props.site,
			action: isActive ? 'loaded' : 'unloaded'
		})
	}
}

export default Vhost;
