import React from 'react';
import * as Store from '../store';
import Site from './Site';
import SiteForm from './SiteForm';
import ImportForm from './ImportForm';
import ExportForm from './ExportForm';

class Sites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sites: [],
			activeSite: null,
			form: false,
			showSiteForm: false,
			showImportForm: false,
			showExportForm: false
		};
	}

	componentWillMount() {
		var sites = Store.load('sites');
		if (!sites.length) {
			this.setState({form: 'site'});
		} else {
			this.setState({sites:sites});
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
							<div className="Site-name" rowSpan="2">Name</div>
							<div className="Site-aliases">Aliases</div>
							<div className="Site-root" colSpan="2">Root</div>
						</div>
						<div className="Sites-body">
							{this.state.sites.map((site, i) => 
								<Site 
									key={site.id} 
									site={site} 
									index={i} 
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
						onSubmit={this.handleNewSiteForm.bind(this)}
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

	onReorder(from, to) {
		var sites = this.state.sites;

		// Re-arrange sites
		sites.splice(to, 0, sites.splice(from, 1)[0]);

		// Re-set pos based on index
		sites.map((site, index) => site.pos = index+1);

		// Save changes
		this.setState({sites});
		Store.save('sites', sites);
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
		this.setState({form: false});
	}

	handleImportError(error) {
		notify(error.toString(), 'negative');
	}

	handleNewSiteForm(e) {
		e.preventDefault();
		let form = e.target;
		let sites = this.state.sites;
		sites = sites.sort((a, b) => a.pos > b.pos);

		let pos = sites.length ? sites[sites.length-1].pos + 1 : 1;

		let siteData = {
			active: 	true,
			name:  		form.name.value.toLowerCase(),
			aliases: 	form.aliases.value,
			root: 		form.root.value,
			pos: 			pos
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
			siteData.id = +new Date;
			sites.push(siteData);
		}

		let newState = Object.assign({}, this.state, { sites }, {form: false});
		this.setState(newState);
		form.name.value = '';
		form.aliases.value = '';
		form.root.value = '';
		Store.save('sites', sites);

		if (form.siteId) {
			notify(`Updated '${siteData.name}' details`, 'positive');
		} else {
			notify(`Added '${siteData.name}' to sites`, 'positive');
		}
	}

	handleExportForm() {
		this.setState({showExportForm: false});
	}

	handleImportForm(data, overwrite) {
		let sites = Store.load('sites');

		sites = overwrite ? data.sites : sites.concat(data.sites);
		sites = this.removeDuplicateSites(sites);

		Store.save('sites', sites);
		this.setState({sites, showImportForm: false});
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
		let site = this.state.sites.find((_, i) => i == action.index);
		let otherSites = this.state.sites.filter((_, i) => i != action.index);

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
					if (i == action.index) {
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
					if (i == action.index) {
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
