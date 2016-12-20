import React from 'react';
import * as Store from '../store';
import Site from './Site';
import SiteForm from './SiteForm';
import ImportForm from './ImportForm';
import ExportForm from './ExportForm';

const SITES = Store.load('sites');

class Sites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sites: SITES,
			activeSite: null,
			showSiteForm: false,
			showExportForm: false,
			showImportForm: false
		};
	}

	componentWillMount() {
		if (!this.state.sites.length) {
			this.setState({showSiteForm: true});
		}
	}

	render() {
		let sites = this.state.sites;
		return (
			<section className="Section Section--sites">
				<div className="ButtonGroup">
					<a className="Button Button" onClick={this.openSiteForm.bind(this)}>Add site</a>
					<a disabled className="Button Button--secondary" onClick={this.openImportForm.bind(this)}>Import sites</a>
					<a disabled className="Button Button--secondary" onClick={this.openExportForm.bind(this)}>Export sites</a>
				</div>

				{this.state.showSiteForm && <SiteForm site={this.state.activeSite} onSubmit={this.handleNewSiteForm.bind(this)} closeForm={this.closeSiteForm.bind(this)} />}
				{this.state.showExportForm && <ExportForm
					onSubmit={this.handleExportForm.bind(this)}
					onCancel={this.closeExportForm.bind(this)}
					/>}
				{this.state.showImportForm && <ImportForm
					onSubmit={this.handleImportForm.bind(this)}
					onCancel={this.closeImportForm.bind(this)}
					onError={this.handleImportError.bind(this)}
					/>}

				{this.state.showSiteForm ||
					<table className="Sites">
						<thead>
							<tr>
								<th className="Site-name">Name</th>
								<th className="Site-aliases">Aliases</th>
								<th className="Site-root" colSpan="2">Root</th>
							</tr>
						</thead>
						<tbody>
							{sites.map((site, i) => <Site key={site.id} site={site} index={i} onChange={this.handleChangeSite.bind(this)} />)}
						</tbody>
					</table>
				}

			</section>
		)
	}

	openSiteForm() {
		this.setState({
			showSiteForm: true,
			showExportForm: false,
			showImportForm: false
		})
	}

	openExportForm() {
		this.setState({
			showSiteForm: false,
			showExportForm: true,
			showImportForm: false
		})
	}

	openImportForm() {
		this.setState({
			showSiteForm: false,
			showExportForm: false,
			showImportForm: true
		})
	}

	openExportForm() {
		this.setState({ showExportForm: true })
	}

	closeSiteForm() {
		this.setState({showSiteForm: false});
	}

	closeExportForm() {
		this.setState({showExportForm: false});
	}

	closeImportForm() {
		this.setState({showImportForm: false});
	}

	handleImportError(error) {
		this.props.showMessage(error.toString(), 'negative');
	}

	handleNewSiteForm(e) {
		e.preventDefault();
		let form = e.target;
		let sites = this.state.sites;

		let siteData = {
			name:  	form.name.value.toLowerCase(),
			aliases: form.aliases.value,
			root: 	form.root.value
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

		let newState = Object.assign({}, this.state, { sites }, {showSiteForm: false});
		this.setState(newState);
		form.name.value = '';
		form.aliases.value = '';
		form.root.value = '';
		Store.save('sites', sites);

		if (form.siteId) {
			this.props.showMessage(`Updated ${siteData.name} details`, 'positive');
		} else {
			this.props.showMessage(`Added ${siteData.name} to sites`, 'positive');
		}
	}

	handleExportForm() {
		this.setState({showExportForm: false});
	}

	handleImportForm(data, overwrite) {
		let sites = SITES;

		sites = overwrite ? data.sites : sites.concat(data.sites);
		sites = this.removeDuplicateSites(sites);

		Store.save('sites', sites);
		this.setState({sites, showImportForm: false});
		this.props.showMessage(`Imported ${data.sites.length} sites`, 'positive');
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
					showSiteForm: true,
					activeSite: site
				});
			break;
			case 'remove':
				Store.save('sites', otherSites);
				this.setState({
					sites: otherSites
				});
				this.props.showMessage(`Removed ${site.name} from sites`, 'positive');
			break;
		}
	}
}

export default Sites
