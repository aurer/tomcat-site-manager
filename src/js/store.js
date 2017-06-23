let defaultValues = {
	settings: {
		domain: '',
		root: '',
		manager_username: '',
		manager_password: ''
	},
	sites: []
}

export function load(item) {
	return JSON.parse(localStorage.getItem(item)) || undefined;
}

export function save(item, value) {
	localStorage.setItem(item, JSON.stringify(value));
	return localStorage.getItem(item);
}

if (localStorage.length == 0) {
	console.log('Store is empty, setting up default values');
	localStorage.setItem('settings', JSON.stringify(defaultValues.settings));
	localStorage.setItem('sites', JSON.stringify(defaultValues.sites));
};
