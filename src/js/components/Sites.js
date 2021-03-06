import React from 'react';
import * as Store from '../store';
import Site from './Site';
import SiteForm from './SiteForm';
import ImportForm from './ImportForm';
import ExportForm from './ExportForm';
import * as Stats from './Stats';

class Sites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sites: [],
			recentSites: [],
			filter: '',
			activeSite: null,
			form: false,
			showSiteForm: false,
			showImportForm: false,
			showExportForm: false
		};
	}

	componentWillMount() {
		const sites = Store.load('sites');
		if (!sites.length) {
			this.setState({form: 'site'});
		} else {
			this.setState({sites});
		}
	}

	render() {
		return (
			<section className="Section Section--sites">
				<div className="ButtonGroup">
					<a className="Button" onClick={this.openSiteForm.bind(this)}>Add site</a>
					<a className="Button" onClick={this.openImportForm.bind(this)}>Import sites</a>
					<a className="Button" onClick={this.openExportForm.bind(this)}>Export sites</a>
				</div>
				{this.state.form == false &&
					<div className="Sites">
						<div className="Sites-header">
							{this.state.form == false &&
								<div className="Sites-filter">
									<input type="search" onChange={this.setFilter.bind(this)} placeholder="Filter..." value={this.state.filter} />
								</div>
							}
							<div className="Site-name" rowSpan="2">Name</div>
							<div className="Site-aliases">Aliases</div>
							<div className="Site-root" colSpan="2">Root</div>
						</div>
						<div className="Sites-body">
							{this.state.sites.filter(this.applyFilter.bind(this)).map((site, i) =>
								<Site
									key={site.id}
									site={site}
									index={i}
									id={site.id}
									onReorder={this.onReorder.bind(this)}
									onChange={this.handleChangeSite.bind(this)}
								/>
							)}
						</div>
					</div>
				}

				{this.state.form == 'site' &&
					<SiteForm
						site={this.state.activeSite}
						onSubmit={this.handleSiteForm.bind(this)}
						closeForm={this.closeForm.bind(this)}
					/>
				}

				{this.state.form == 'export' &&
					<ExportForm
						onSubmit={this.handleExportForm.bind(this)}
						onCancel={this.closeForm.bind(this)}
					/>
				}

				{this.state.form == 'import' &&
					<ImportForm
						onSubmit={this.handleImportForm.bind(this)}
						onCancel={this.closeForm.bind(this)}
						onError={this.closeForm.bind(this)}
					/>
				}
			</section>
		)
	}

	applyFilter(item) {
		if (!this.state.filter.length) return true;
		let regex = new RegExp(this.state.filter, "ig");
		return item.name.match(regex)
	}

	setFilter(e) {
		this.setState({filter:e.target.value});
		let search = e.target.value;
	}

	onReorder(from, to, save=false) {
		var sites = this.state.sites;

		// Re-arrange sites
		sites.splice(to, 0, sites.splice(from, 1)[0]);

		// Re-set pos based on index
		sites.map((site, index) => site.pos = index+1);

		// Save changes
		this.setState({sites});

		if (save) {
			Store.save('sites', sites);
		}
	}

	openSiteForm() {
		this.setState({
			form: 'site'
		});
	}

	openExportForm() {
		this.setState({
			form: 'export'
		});
	}

	openImportForm() {
		this.setState({
			form: 'import'
		});
	}

	closeForm() {
		this.setState({
			form: false,
			activeSite: null
		});
	}

	handleImportError(error) {
		notify(error.toString(), 'negative');
	}

	handleSiteForm(e) {
		e.preventDefault();
		let form = e.target;
		let sites = this.state.sites;

		let siteData = {
			name:  		form.name.value.toLowerCase(),
			aliases: 	form.aliases.value,
			root: 		form.root.value
		}

		// Update existing site
		if (form.siteId) {
			let siteId = parseInt(form.siteId.value);
			sites = sites.map(site => {
				if (site.id == siteId) {
					return Object.assign({}, site, siteData);
				}
				return site;
			});
		} else {
			siteData.active = true;
			siteData.pos = sites.length ? sites[sites.length-1].pos + 1 : 1;
			siteData.id = +new Date;
			sites.push(siteData);
		}

		let newState = Object.assign({}, this.state, { sites }, {form: false});
		this.setState(newState);
		Store.save('sites', sites);

		if (form.siteId) {
			notify(`Updated '${siteData.name}' details`, 'positive');
			Stats.record(siteData.name, 'updated');
		} else {
			notify(`Added '${siteData.name}' to sites`, 'positive');
			Stats.record(siteData.name, 'added');
		}
	}

	handleExportForm() {
		this.setState({form: false});
	}

	handleImportForm(data, overwrite) {
		let sites = Store.load('sites');

		sites = overwrite ? data.sites : sites.concat(data.sites);
		sites = this.removeDuplicateSites(sites);

		Store.save('sites', sites);
		this.setState({sites, form: false});
		notify(`Imported ${data.sites.length} sites`, 'positive');
	}

	removeDuplicateSites(sites) {
		var filteredSites = []
		sites.forEach(site => {
			var match = filteredSites.find(otherSite => {
				return (otherSite.name == site.name &&
					otherSite.aliases == site.aliases &&
					otherSite.root == site.root);
			});
			if (!match) {
				filteredSites.push(site);
			}
		});
		return filteredSites;
	}

	handleChangeSite(action) {
		let site = this.state.sites.find(site => site.id == action.id);
		let otherSites = this.state.sites.filter(site => site.id != action.id);

		switch (action.action) {
			case 'edit':
				this.setState({
					form: 'site',
					activeSite: site
				});
			break;
			case 'remove':
				Store.save('sites', otherSites);
				this.setState({
					sites: otherSites
				});
				notify(`Removed '${site.name}' from sites`, 'positive');
			break;
			case 'activate':
				var newState = this.state.sites.map((site, i) => {
					if (site.id == action.id) {
						site.active = true
					}
					return site
				});
				this.setState({
					sites: newState
				});
				Store.save('sites', newState);
			break;
			case 'deactivate':
				var newState = this.state.sites.map((site, i) => {
					if (site.id == action.id) {
						site.active = false
					}
					return site
				});
				this.setState({
					sites: newState
				});
				Store.save('sites', newState);
			break;
		}
	}
}

export default Sites
