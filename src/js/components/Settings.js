import React from 'react';
import * as Store from '../store';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.load('settings');
		console.log(props.location);
	}

	render() {
		let rootPlacerholder = 'c:\\www\\';
		return (
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<label htmlFor="">Local domain name</label>
					<div className="Form-inputs">
						<input type="text" name="domain" defaultValue={this.state.domain} placeholder="yourname.netxtra.local" autoComplete="off" />
					</div>
				</div>
				<div className="Form-field">
					<label htmlFor="">Web root directory</label>
					<div className="Form-inputs">
						<input type="text" name="root" defaultValue={this.state.root} placeholder={rootPlacerholder} autoComplete="off" />
					</div>
				</div>
				<div className="Form-field">
					<label htmlFor="">Tomcat version</label>
					<div className="Form-inputs">
						<input type="text" name="tomcat_version" defaultValue={this.state.tomcat_version} autoComplete="off" />
					</div>
				</div>
				<div className="Form-field">
					<label htmlFor="">Hostmanager login</label>
					<div className="Form-inputs">
						<input type="text" name="manager_username" defaultValue={this.state.manager_username} placeholder="Username" autoComplete="off" />
						<input type="password" name="manager_password" defaultValue={this.state.manager_password} placeholder="Password" autoComplete="off" />
					</div>
				</div>
				<input type="submit"/>
			</form>
		)
	}

	handleSubmit(e) {
		e.preventDefault()
		let form = e.target,
			domain = this.sanitiseDomainValue(form.domain.value),
			root = this.sanitiseRootValue(form.root.value),
			tomcat_version = form.tomcat_version.value,
			manager_username = form.manager_username.value,
			manager_password = form.manager_password.value;

		let newState = Object.assign({}, this.state, {
			domain,
			root,
			tomcat_version,
			manager_username,
			manager_password
		});

		form.domain.value = domain;
		form.root.value = root;

		Store.save('settings', newState);
		this.setState(newState);
		this.props.showMessage(`Settings updated`, 'positive');
	}

	sanitiseDomainValue(value) {
		return value.replace(/\s+/g, '');
	}

	sanitiseRootValue(value) {
		return value.replace(/\s+/g, '').replace(/[\/\\]$/g, '');
	}
}

export default Settings
