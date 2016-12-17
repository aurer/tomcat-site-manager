import React from 'react';
import * as Store from '../store';
import Site from './Site';
import SiteForm from './SiteForm';

class Sites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sites: Store.load('sites'),
			activeSite: null,
			showForm: false
		};
	}

	render() {
		let sites = this.state.sites;

		return (
			<section className="Section Section--sites">
				<div className="ButtonGroup">
					<a className="Button Button" onClick={this.toggleForm.bind(this)}>Add site</a>
					<a disabled className="Button Button--secondary" onClick={this.handleImportSites.bind(this)}>Import sites</a>
					<a disabled className="Button Button--secondary" onClick={this.handleExportSites.bind(this)}>Export sites</a>
				</div>

				{this.state.showForm && <SiteForm site={this.state.activeSite} onSubmit={this.handleSubmit.bind(this)} />}

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

			</section>
		)
	}

	toggleForm() {
		this.setState({ showForm: !this.state.showForm })
	}

	handleSubmit(e) {
		e.preventDefault();
		let form = e.target;
		let sites = this.state.sites;

		let siteData = {
			name:  	form.name.value,
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

		let newState = Object.assign({}, this.state, { sites }, {showForm: false});
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

	handleChangeSite(action) {
		let site = this.state.sites.find((_, i) => i == action.index);
		let otherSites = this.state.sites.filter((_, i) => i != action.index);

		switch (action.action) {
			case 'edit':
				this.setState({
					showForm: true,
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

	handleImportSites() {
		console.log('Import sites');
	}

	handleExportSites() {
		console.log('Export sites');

	}

}

export default Sites
