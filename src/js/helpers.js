import qwest from 'qwest';
import * as Store from './store';

export function parseHTML(string) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(string, 'text/html');
	var form = doc.querySelector('form');
	return doc;
}

export function findCsrfToken(html) {
	var form = html.querySelector('form');
	return form.getAttribute('action').match(/CSRF_NONCE=([\w]+)/)[1];
}

export function findManagerSite(html) {
	var siteLinks = html.querySelectorAll('td.row-left small a');
	var managerSites = [];

	// Workaround for Safari which doesn't like 'forEach' on nodeLists ???
	for (var i = 0; i < siteLinks.length; i++) {
		var link = siteLinks.item(i);
		managerSites.push({
			link: link.href,
			name: link.outerText
		})
	}

	return managerSites;
}

export function compileAliasString(name, aliases) {
	var settings = Store.load('settings');
	return aliases.split(',').map(alias => {
		return alias.replace(/\s/g, '') + '.' + name + '.' + settings.domain
	}).join(', ');
}

export function managerAddSite(site) {
	var settings = Store.load('settings');
	var data = {
		name: `${site.name}.${settings.domain}`,
		aliases: compileAliasString(site.name, site.aliases),
		appBase: settings.root + site.root,
		autoDeploy: 'on',
		deployOnStartup: 'on',
		deployXml: 'on',
		unpackWARs: 'on',
		'org.apache.catalina.filters.CSRF_NONCE': window.csrfToken
	};
	return qwest.post('http://localhost:8080/host-manager/html/add', data);
}

function managerControlSite(action, site) {
	return qwest.post('http://localhost:8080/host-manager/html/' + action, {
		name: site,
		'org.apache.catalina.filters.CSRF_NONCE': window.csrfToken
	});
}

export function managerStopSite(site) {
	return managerControlSite('stop', site);
}

export function managerStartSite(site) {
	return managerControlSite('start', site);
}

export function managerRemoveSite(site) {
	return managerControlSite('remove', site);
}

export function svgPath(svg) {
	var svgPath = '../';
	if (typeof safari !== 'undefined') {
		svgPath = safari.extension.baseURI;
	}
	return svgPath + 'img/' + svg;
}

export function openTab(url) {
	// Open from Chrome
	if (typeof chrome != 'undefined') {
		var urlSearch = url.replace(/[\/]$/g, '') + '/*';
		chrome.tabs.query({url: urlSearch}, tab => {
			if (tab && tab.length) {
				chrome.tabs.reload(tab[0].id);
				chrome.tabs.update(tab[0].id, {active: true});
				return;
			}

			// Look for empty tabs and load site in it if one is found, otherwise create a new one.
			chrome.tabs.query({url: "chrome://*/"}, tab => {
				if( tab.length > 0 ){
					return chrome.tabs.update( tab[0].id, { url: url, active: true} );
				}

				return chrome.tabs.create({ url: url });
			});
		});

		return;
	}

	// Open from safari
	if (typeof safari != 'undefined') {
		let newTab = safari.application.activeBrowserWindow.openTab();
		newTab.url = url;
		return;
	}

	// Default open from browser
	window.open(url);
}
