import React from 'react';
import qwest from 'qwest';
import { Link } from 'react-router';
import Vhost from './Vhost';
import * as Store from '../store';
import { parseHTML, findCsrfToken, findManagerSite } from '../helpers';

const SITES = Store.load('sites');
const SETTINGS = Store.load('settings');

class Vhosts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			canSeeTomcatManager: true,
			loading: false,
			sites: [],
			settings: {},
			managerSites: [],
			csrfToken: ''
		};
	}

	componentWillMount() {
		this.loginToHostManager();
		this.setState({sites: SITES, settings: SETTINGS});
	}

	render() {
		if (!this.state.canSeeTomcatManager) {
			return (<p className="Message Message--negative">Failed to reach Tomcat manager - please ensure it is running</p>)
		}

		if (this.state.sites.length < 1) {
			return (<p className="Message Message--info">You dont have any sites defined yet<br/><br/><Link to="sites.html">Add one now</Link></p>)
		}

		return (
			<div className="Vhosts">
				{this.state.sites.map((site, i) => <Vhost
					key={site.id}
					site={site}
					settings={this.state.settings}
					index={i}
					managerSites={this.state.managerSites}
					onChange={this.handleVhostChange.bind(this)}
					csrfToken={this.state.csrfToken} /> )}
			</div>
		)
	}

	handleVhostChange(action) {
		let message = '';
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
		this.props.showMessage(message, 'positive');

		// Update vhost props with new manager info
		this.updateManagerInfo(action.response);
	}

	loginToHostManager() {
		let url = `http://localhost:8080/host-manager/html/`;
		qwest.get(url, null, {
			user: SETTINGS.manager_username,
			password: SETTINGS.manager_password
		})
		.then((xhr, res) => {
			this.updateManagerInfo(res);
		})
		.catch((error, xhr) => {
			console.error(error, xhr);
		})
	}

	updateManagerInfo(response) {
		let html = parseHTML(response);
		let managerSites = findManagerSite(html);
		let csrfToken = findCsrfToken(html);
		this.setState({
			canSeeTomcatManager: true,
			managerSites,
			csrfToken
		});
	}
}

export default Vhosts;
