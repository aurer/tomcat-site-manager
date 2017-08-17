import React from 'react';
import Vhost from './Vhost';
import * as Store from '../store';
import { parseHTML, findCsrfToken, findManagerSite, openTab } from '../helpers';
import LoadingScreen from './LoadingScreen';

class Vhosts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			canSeeTomcatManager: null,
			loading: false,
			loadAction: null,
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
					<p><a onClick={this.openManager.bind(this)}>Check Tomcat is running</a></p>
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

		let vHostsClassName = "VhostWrapper" + (this.state.loading ? ' is-loading' : '');
		return (
			<div className={vHostsClassName}>
				{this.state.loading && <LoadingScreen site={this.state.loading} action={this.state.loadAction} />}
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
			</div>
		)
	}

	handleVhostChange(action) {
		var message = '';
		switch (action.type) {
			case 'load':
				this.setState({
					loading: action.site,
					loadAction: action.action
				});
			break;
			case 'start':
				notify(`Started ${action.site.name}`, 'positive');
				this.updateManagerInfo(action.response);
			break;
			case 'restart':
				notify(`Restarted ${action.site.name}`, 'positive');
				this.updateManagerInfo(action.response);
			break;
			case 'stop':
				notify(`Stopped ${action.site.name}`, 'positive');
				this.updateManagerInfo(action.response);
			break;
		}
	}

	openManager() {
		openTab('http://localhost:8080/host-manager/html/');
	}

	connectToHostManager() {
		var url = 'http://localhost:8080/host-manager/html/';
		fetch(url, { credentials: 'include' })
			.then(res => {
				if (res.ok) {
					this.setState({ canSeeTomcatManager: true });
					return res.text();
				} else {
					this.setState({ canSeeTomcatManager: false });
				}
			})
			.then(this.updateManagerInfo.bind(this))
			.catch(error => {
				this.setState({ canSeeTomcatManager: false });
			});
	}

	updateManagerInfo(response) {
		var html = parseHTML(response);
		var managerSites = findManagerSite(html);
		var csrfToken = findCsrfToken(html);
		window.csrfToken = csrfToken;
		this.setState({ managerSites, loading: false });
	}
}

export default Vhosts;
