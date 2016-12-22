import React from 'react';
import qwest from 'qwest';
import { Link } from 'react-router';
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
		this.loginToHostManager();
		this.setState({sites: Store.load('sites'), settings: Store.load('settings')});
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

		if (this.state.canSeeTomcatManager === false) {
			return (
				<div className="App-error">
					<p>Could not connect to Tomcat</p>
					<p>Please check Tomcat is running and that the username and password you supplied are correct</p>
				</div>
			)
		}

		if (this.state.sites.length < 1) {
			return (
				<div className="App-error">
					<p>You dont have any sites defined yet<br/><br/><Link to="sites.html">Add one now</Link></p>
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
					onChange={this.handleVhostChange.bind(this)} /> )}
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
			user: this.state.settings.manager_username,
			password: this.state.settings.manager_password
		})
		.then((xhr, res) => {
			this.setState({ canSeeTomcatManager: true });
			this.updateManagerInfo(res);
		})
		.catch((error, xhr) => {
			console.log(error, xhr);
			this.setState({ canSeeTomcatManager: false });
		})
	}

	updateManagerInfo(response) {
		let html = parseHTML(response);
		let managerSites = findManagerSite(html);
		let csrfToken = findCsrfToken(html);
		window.csrfToken = csrfToken;
		this.setState({ managerSites });
	}
}

export default Vhosts;
