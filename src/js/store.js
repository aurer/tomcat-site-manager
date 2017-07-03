let defaultValues = {
	settings: {
		domain: '',
		root: '',
		os: 'windows'
	},
	sites: []
}

// Add events
var onStorageLoad = new Event('onstorageload');
var onStorageSave = new Event('onstoragesave');

export function load(item) {
	window.dispatchEvent(onStorageLoad);
	return JSON.parse(localStorage.getItem(item)) || undefined;
}

export function save(item, value) {
	localStorage.setItem(item, JSON.stringify(value));
	window.dispatchEvent(onStorageSave);
	return localStorage.getItem(item);
}

if (localStorage.length == 0) {
	console.log('Store is empty, setting up default values');
	localStorage.setItem('settings', JSON.stringify(defaultValues.settings));
	localStorage.setItem('sites', JSON.stringify(defaultValues.sites));
};
