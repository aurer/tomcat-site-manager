import React from 'react';
import * as Store from '../store';
import Site from './Site';

class Sites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {sites: Store.load('sites')};
		console.log('Wating for window event');
		window.addEventListener('storage', (e) => {
			console.log('Storage', e);
		})
	}

	render() {
		let sites = this.state.sites;

		return (
			<section className="Section Section--sites">
				{/*
				<a className="Button Button">Add site</a>
				<a disabled className="Button Button--secondary">Import sites</a>
				<a disabled className="Button Button--secondary">Export sites</a>
				*/}
				<form className="Form" onSubmit={this.handleAddSiteSubmit.bind(this)}>
					<div className="Form-field">
						<label>Site name</label>
						<div className="Form-inputs">
							<input type="text" name="name"/>
						</div>
					</div>
					<div className="Form-field">
						<label>Site aliases</label>
						<div className="Form-inputs">
							<input type="text" name="aliases"/>
						</div>
					</div>
					<div className="Form-field">
						<label>Site root</label>
						<div className="Form-inputs">
							<input type="text" name="root"/>
						</div>
					</div>
					<div className="Form-field">
						<input type="submit" className="Button" value="Add site"/>
					</div>
				</form>

				<table className="Sites">
					<thead>
						<tr>
							<th className="Site-name">Name</th>
							<th className="Site-aliases">Aliases</th>
							<th className="Site-root" colSpan="2">Root</th>
						</tr>
					</thead>
					<tbody>
						{sites.map((site, i) => <Site key={site.id} site={site} index={i} onChange={this.handleRemoveSite.bind(this)} />)}
					</tbody>
				</table>

			</section>
		)
	}

	handleAddSiteSubmit(e) {
		e.preventDefault();
		let sites = this.state.sites;
		let form = e.target;
		let newSite = {
			id: +new Date,
			name:  	form.name.value,
			aliases: form.aliases.value,
			root: 	form.root.value
		}
		sites.push(newSite);
		Store.save('sites', sites);
		let newState = Object.assign({}, this.state, { sites });
		this.setState(newState);

		form.name.value = '';
		form.aliases.value = '';
		form.root.value = '';
	}

	handleRemoveSite(action) {
		let newSites = this.state.sites.filter((_, i) => i != action.index);
		Store.save('sites', newSites);
		this.setState({
			sites: newSites
		});
	}
}

export default Sites
