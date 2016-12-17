import React from 'react';
import * as Store from '../store';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.load('settings');
	}

	render() {
		return (
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<label htmlFor="">Local domain name</label>
					<div className="Form-inputs">
						<input type="text" name="domain" defaultValue={this.state.domain} />
					</div>
				</div>
				<div className="Form-field">
					<label htmlFor="">Web root directory</label>
					<div className="Form-inputs">
						<input type="text" name="root" defaultValue={this.state.root} />
					</div>
				</div>
				<div className="Form-field">
					<label htmlFor="">Tomcat version</label>
					<div className="Form-inputs">
						<input type="text" name="tomcat_version" defaultValue={this.state.tomcat_version} />
					</div>
				</div>
				<div className="Form-field">
					<label htmlFor="">Hostmanager login</label>
					<div className="Form-inputs">
						<input type="text" name="manager_username" defaultValue={this.state.manager_username} placeholder="Username"/>
						<input type="password" name="manager_password" defaultValue={this.state.manager_password} placeholder="Password"/>
					</div>
				</div>
				<input type="submit"/>
			</form>
		)
	}

	handleSubmit(e) {
		e.preventDefault()
		let form = e.target,
			domain = form.domain.value,
			root = form.root.value,
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

		Store.save('settings', newState);
		this.setState(newState);
		this.props.showMessage(`Settings updated`, 'positive');
	}
}

export default Settings
