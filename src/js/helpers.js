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

export function compileAliasString(name, aliasString) {
	if (!aliasString.length) {
		return '';
	}

	var settings = Store.load('settings');
	var aliases = aliasString.replace(/\s/g, '').split(',');
	return aliases.map(alias => {
		return alias + '.' + name + '.' + settings.domain
	}).join(', ');
}

export function managerAddSite(site) {
	var settings = Store.load('settings');

	var formParams = new URLSearchParams();
	formParams.set('name', `${site.name}.${settings.domain}`);
	formParams.set('aliases', compileAliasString(site.name, site.aliases));
	formParams.set('appBase', settings.root + site.root);
	formParams.set('autoDeploy', 'on');
	formParams.set('deployOnStartup', 'on');
	formParams.set('deployXML', 'on');
	formParams.set('unpackWARs', 'on');
	formParams.set('org_apache_catalina_filters_CSRF_NONCE', window.csrfToken);

	var managerUrl = 'http://localhost:8080/host-manager/html/add';
	var token = 'org.apache.catalina.filters.CSRF_NONCE=' + window.csrfToken;

	return fetch(`${managerUrl}?${token}`, {
		credentials: 'include',
		method: 'POST',
		headers: {
    	'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  	},
		body: formParams
	});
}

function managerControlSite(action, site) {
	var managerUrl = 'http://localhost:8080/host-manager/html/' + action;
	var token = 'org.apache.catalina.filters.CSRF_NONCE=' + window.csrfToken

	console.info(action, site);

	return fetch(`${managerUrl}?${token}&name=${site}`, {
		credentials: 'include',
		method: 'POST',
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
