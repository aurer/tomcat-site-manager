import qwest from 'qwest';
import * as Store from './store';

const SETTINGS = Store.load('settings');

export function parseHTML(string) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(string, 'text/html');
	var form = doc.querySelector('form.inline');
	return doc;
}

export function findCsrfToken(html) {
	var form = html.querySelector('form.inline');
	return form.getAttribute('action').match(/CSRF_NONCE=([\w]+)/)[1];
}

export function findManagerSite(html) {
	var siteLinks = html.querySelectorAll('td.row-left small a');
	var managerSites = []
	siteLinks.forEach(link => {
		managerSites.push({
			link: link.href,
			name: link.outerText
		})
	});
	return managerSites;
}

export function managerAddSite(site, token) {
	var data = {
		name: site.name,
		aliases: site.aliases,
		appBase: SETTINGS.root + site.root,
		autoDeploy: 'on',
		deployOnStartup: 'on',
		deployXml: 'on',
		unpackWARs: 'on',
		'org.apache.catalina.filters.CSRF_NONCE': token
	};
	return qwest.post('http://localhost:8080/host-manager/html/add', data);
}

function managerControlSite(action, site, token) {
	return qwest.post('http://localhost:8080/host-manager/html/' + action, {
		name: site,
		'org.apache.catalina.filters.CSRF_NONCE':token
	});
}

export function managerStopSite(site, token) {
	return managerControlSite('stop', site, token);
}

export function managerStartSite(site, token) {
	return managerControlSite('start', site, token);
}

export function managerRemoveSite(site, token) {
	return managerControlSite('remove', site, token);
}
