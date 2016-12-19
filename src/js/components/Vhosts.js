import React from 'react';
import qwest from 'qwest';
import { Link, Redirect } from 'react-router';
import * as Store from '../store';
import Vhost from './Vhost';

class Vhosts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			canSeeTomcatManager: true,
			loading: false,
			sites: [],
			managerSites: []
		};
	}

	componentWillMount() {
		let sites = Store.load('sites');
		this.loginToHostManager();
		this.setState({sites});
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
				{this.state.sites.map((site, i) => <Vhost key={site.id} site={site} index={i} onChange={this.handleVhostChange.bind(this)} /> )}
			</div>
		)
	}

	handleVhostChange(action) {
		let message = '';
		switch (action.type) {
			case 'start':
				message = `Started ${action.data.site.name}`;
			break;
			case 'restart':
				message = `Restarted ${action.data.site.name}`;
			break;
			case 'stop':
				message = `Stopped ${action.data.site.name}`;
			break;
		}
		this.props.showMessage(message, 'positive');
	}

	loginToHostManager() {
		let url = `http://localhost:8080/host-manager/html/`;
		let settings = Store.load('settings');

		qwest.get(url, null, {
			user: settings.manager_username,
			password: settings.manager_password
		})
		.then((xhr, res) => {
			let el = document.createElement('html');
			el.innerHTML = res;
			let siteLinks = el.querySelectorAll('td.row-left small a');
			var managerSites = [];
			siteLinks.forEach(link => {
				managerSites.push({
					link: link.href,
					name: link.outerText
				})
			});

			this.setState({
				canSeeTomcatManager: true,
				managerSites
			})
		})
		.catch((error, xhr) => {
			console.error(error, xhr);
		})
	}

	openManager() {
		chrome.tabs.create({url:'http://localhost:8080/host-manager/html/'});
	}

	openSettings() {
		let settings = chrome.extension.getURL("settings.html");
		chrome.tabs.create( { url:settings } );
	}

	openSites() {
		let settings = chrome.extension.getURL("sites.html");
		chrome.tabs.create( { url:settings } );
	}
}

export default Vhosts;
