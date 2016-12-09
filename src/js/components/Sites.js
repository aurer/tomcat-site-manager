import React from 'react';
import * as Store from '../store';
import Site from './Site';

class Sites extends React.Component {
	constructor(props) {
		super(props);
		this.state = {sites: Store.load('sites')};
	}

	render() {
		let sites = this.state.sites;
		return (
			<section className="Sites">
				<a className="Button Button">Add site</a>
				<a disabled className="Button Button--secondary">Import sites</a>
				<a disabled className="Button Button--secondary">Export sites</a>
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
						<input type="submit" className="Button"/>
					</div>
				</form>

				<table>
					<thead>
						<tr>
							<td>Name</td>
							<td>Aliases</td>
							<td>Path</td>
						</tr>
					</thead>
					<tbody>
						{sites.map((site, i) => <Site key={i} site={site} />)}
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
}

export default Sites
