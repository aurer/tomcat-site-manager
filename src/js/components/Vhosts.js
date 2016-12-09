import React from 'react';
import qwest from 'qwest';
import * as Store from '../store';

var HTMLParser = require('fast-html-parser');

class Vhosts extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			loggedIn: false,
			loading: false,
			sites: []
		}
	}

	componentWillMount() {
		this.loginToHostManager();
	}

	render() {
		var sectionClassName = "Section Section--vhosts";

		if (!this.state.loggedIn) {
			return (<section className={sectionClassName}>
				<p className="Message Message--negative">Failed to reach Tomcat manager - please ensure it is running</p>
			</section>)
		}

		return (
			<section className={sectionClassName}>
				<div className="ButtonGroup">
					<a className="Button" onClick={this.openSettings}>Settings</a>
					<a className="Button" onClick={this.openSites}>Sites</a>
					<a className="Button" onClick={this.openManager}>Manager</a>
				</div>
				{this.state.sites.map((site, i) => <p key={i}>{site.name}</p> )}
			</section>
		)
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
			var sites = [];
			siteLinks.forEach(link => {
				sites.push({
					link: link.href,
					name: link.outerText
				})
			})
			this.setState({
				loggedIn:true,
				sites: sites
			})
		})
		.catch((error, xhr) => {
			console.error(error);
			console.log(xhr);
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
