import React from 'react';
import Vhost from './Vhost';
import * as Store from '../store';
import { parseHTML, findCsrfToken, findManagerSite } from '../helpers';

class Vhosts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			canSeeTomcatManager: null,
			loading: false,
			sites: [],
			settings: {},
			managerSites: []
		};
	}

	componentWillMount() {
		var sites = Store.load('sites').filter(site => site.active);
		var settings = Store.load('settings');
		this.connectToHostManager();
		this.setState({sites, settings});
	}

	render() {
		if (this.state.canSeeTomcatManager === null) {
			return (
				<div className="App-error">
					<p>Connecting to Tomcat...</p>
					<progress></progress>
				</div>
			)
		}

		if (window.location.hostname != "localhost" && this.state.canSeeTomcatManager === false) {
			return (
				<div className="App-error">
					<p>Could not connect to Tomcat</p>
					<p>Please check Tomcat is running</p>
				</div>
			)
		}

		if (this.state.sites.length < 1) {
			return (
				<div className="App-error">
					<p>You dont have any active sites yet</p>
				</div>
			)
		}

		return (
			<div className="Vhosts">
				{this.state.sites.map((site, i) => <Vhost
					key={site.id}
					site={site}
					settings={this.state.settings}
					index={i}
					managerSites={this.state.managerSites}
					onChange={this.handleVhostChange.bind(this)} />
				)}
			</div>
		)
	}

	handleVhostChange(action) {
		var message = '';
		switch (action.type) {
			case 'start':
				message = `Started '${action.site.name}'`;
			break;
			case 'restart':
				message = `Restarted '${action.site.name}'`;
			break;
			case 'stop':
				message = `Stopped '${action.site.name}'`;
			break;
		}
		notify(message, 'positive');

		// Update vhost props with new manager info
		this.updateManagerInfo(action.response);
	}

	connectToHostManager() {
		var url = 'http://localhost:8080/host-manager/html/';
		fetch(url, { credentials: 'include' })
			.then(res => {
				if (res.ok) {
					this.setState({ canSeeTomcatManager: true })
					return res.text();
				} else {
					this.setState({ canSeeTomcatManager: false })
					throw new Error(res.statusText)
				}
			})
			.then(this.updateManagerInfo.bind(this))
	}

	updateManagerInfo(response) {
		var html = parseHTML(response);
		var managerSites = findManagerSite(html);
		var csrfToken = findCsrfToken(html);
		window.csrfToken = csrfToken;
		this.setState({ managerSites });
	}
}

export default Vhosts;
