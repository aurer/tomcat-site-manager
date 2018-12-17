import React from 'react';
import base64 from 'base-64';
import Vhost from './Vhost';
import * as Store from '../store';
import { parseHTML, findCsrfToken, findManagerSite, openTab } from '../helpers';
import LoadingScreen from './LoadingScreen';
import * as Stats from './Stats';

class Vhosts extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			canSeeTomcatManager: null,
			loading: false,
			loadAction: null,
			sites: [],
			recentSites: [],
			settings: {},
			managerSites: []
		};
	}

	componentWillMount() {
		this.setState({settings: Store.load('settings')});
		this.populateSites();
	}

	populateSites() {
		const allSites = Store.load('sites').filter(site => site.active).sort(site => site.active);
		const recentSiteNames = Stats.getRecent(5);
		let sites = [];
		let recentSites = [];
		allSites.forEach(site => {
			if (recentSiteNames.includes(site.name)) {
				recentSites.push(site);
			} else {
				sites.push(site);
			}
		})
		this.connectToHostManager();
		this.setState({sites, recentSites});
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
					{this.state.tomcatStatusCode == 401 && <p>Check your username and password</p>}
					{this.state.tomcatStatusCode == 401 || <p><a onClick={this.openManager.bind(this)}>Check Tomcat is running</a></p>}
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

		let vHostsClassName = "Section Section--vhosts" + (this.state.loading ? ' is-loading' : '');
		return (
			<section className={vHostsClassName}>
				{this.state.loading && <LoadingScreen site={this.state.loading} action={this.state.loadAction} />}
				<div className="Vhosts">
					<h2>Recently used</h2>
					{this.state.recentSites.map((site, i) => <Vhost
						key={site.id}
						site={site}
						settings={this.state.settings}
						index={i}
						managerSites={this.state.managerSites}
						onChange={this.handleVhostChange.bind(this)} />
					)}
					<h2>Others</h2>
					{this.state.sites.map((site, i) => <Vhost
						key={site.id}
						site={site}
						settings={this.state.settings}
						index={i}
						managerSites={this.state.managerSites}
						onChange={this.handleVhostChange.bind(this)} />
					)}
				</div>
			</section>
		)
	}

	handleVhostChange(action) {
		let message = '';
		switch (action.type) {
			case 'load':
				this.setState({
					loading: action.site,
					loadAction: action.action
				});
			break;
			case 'start':
				notify(`Started ${action.site.name}`, 'positive');
				Stats.record(action.site, 'started');
				this.updateManagerInfo(action.response);
			break;
			case 'restart':
				notify(`Restarted ${action.site.name}`, 'positive');
				Stats.record(action.site, 'restarted');
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
		let url = 'http://localhost:8080/host-manager/html/';
		let settings = Store.load('settings')
		let headers = new Headers();
		headers.append('Authorization', 'Basic ' + base64.encode(`${settings.username}:${settings.password}`))
		fetch(url, { credentials: 'include', headers: headers })
			.then(res => {
				if (res.ok) {
					this.setState({ canSeeTomcatManager: true });
					return res.text();
				} else {
					notify('Hostmanager login failed: ' + res.status)
					this.setState({
						canSeeTomcatManager: false,
						tomcatStatusCode: res.status
					});
				}
			})
			.then(this.updateManagerInfo.bind(this))
			.catch(error => {
				this.setState({ canSeeTomcatManager: false });
			})
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
