export const record = function(site, action) {
	console.log(site.name, action);
	let stats = new Stats();
	stats.update(site.name, action);
}

export const getRecent = function(limit) {
	return new Stats()
		.stats
		.filter(stat => stat.action.endsWith('started'))
		.slice(0, limit)
		.map(stat => stat.name)
}

class Stats {
	constructor() {
		this.load();
	}

	load() {
		this.stats = JSON.parse(localStorage.getItem('stats') || '[]');
	}

	save() {
		let stats = this.stats.sort((a,b) => b.timestamp - a.timestamp).slice(0,21);
		return localStorage.setItem('stats', JSON.stringify(stats));
	}

	update(sitename, action) {
		let existingStat = this.stats.find(stat => stat.name === sitename && stat.action === action);
		
		if (existingStat) {
			existingStat.timestamp = new Date().getTime();
		} else {
			this.stats.push({
				name: sitename,
				action: action,
				timestamp: new Date().getTime()
			})
		}

		this.save();
	}

	remove(sitename) {
		this.stats = this.stats.filter(stat => stat.name !== sitename);
	}
}