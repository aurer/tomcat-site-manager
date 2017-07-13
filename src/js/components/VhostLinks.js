import React from 'react';
import { openTab } from '../helpers';
import * as Store from '../store';
import { OpenIcon } from './Icons';

class VhostLinks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAliases: false
		}
	}

	render() {
		var site = this.props.site;
		var active = this.props.active;
		var aliases = this.createAliases();

		if (!active) {
			return (
				<span className="Vhost-siteLinks"><span className="Vhost-name">{site.name}</span></span>
			);
		}

		var className = "Vhost-siteLinks";
		if (this.state.showAliases) {
			className += ' is-active';
		}
		return (
			<span className={className} onMouseLeave={this.onMouseLeave.bind(this)}>
				<a className="Vhost-name" onClick={this.launchSite.bind(this, this.props.site.name)}>{this.props.site.name}</a>
				{aliases.length > 0 && <button className="Vhost-aliasToggle" onClick={this.toggleAliasLinks.bind(this)}>
					<OpenIcon />
				</button>}
				<span className="Vhost-aliases">
					{aliases.map(url => <a key={url} className="Vhost-name" onClick={this.launchSite.bind(this, url)}>{url}</a>)}
				</span>
			</span>
		)
	}

	onMouseLeave() {
		this.setState({
			showAliases: false
		});
	}

	createAliases() {
		var baseName = this.props.site.name;
		let aliases = [];
		if (this.props.site.aliases != '') {
			this.props.site.aliases.split(',').forEach(alias => {
				aliases.push(alias.replace(/\s/g, '') + '.' + baseName);
			});
		}
		return aliases;
	}

	toggleAliasLinks() {
		this.setState({
			showAliases: !this.state.showAliases
		});
	}

	launchSite(url) {
		var settings = Store.load('settings');
		var fullUrl = 'http://' + url + '.' + settings.domain + ':8080';
		openTab(fullUrl);
	}
}

export default VhostLinks;
