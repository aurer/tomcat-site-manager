import React from 'react';
import * as Store from '../store';
import {getOSSlash} from '../helpers';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.load('settings');
	}

	componentWillMount() {
		this.setState(Store.load('settings'));
	}

	render() {
		let rootPlacerholder = getOSSlash() == '\\' ? 'e.g. c:\\www\\' : 'e.g. /www/';
		return (
			<section className="Section Section--settings">
				<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
					<fieldset>
						<legend>Local Environment</legend>
						<div className="Form-field">
							<label>Local domain</label>
							<div className="Form-inputs">
								<input type="text" name="domain" defaultValue={this.state.domain} placeholder="yourname.netxtra.local" autoComplete="off" />
							</div>
						</div>
						<div className="Form-field">
							<label>Web root</label>
							<div className="Form-inputs">
								<input type="text" name="root" defaultValue={this.state.root} placeholder={rootPlacerholder} autoComplete="off" />
							</div>
						</div>
					</fieldset>
					<fieldset>
						<legend>Tomcat Virtual Host Manager</legend>
						<div className="Form-field">
							<label>Username</label>
							<div className="Form-inputs">
								<input type="text" name="username" defaultValue={this.state.username} autoComplete="off" />
							</div>
						</div>
						<div className="Form-field">
							<label>Password</label>
							<div className="Form-inputs">
								<input type="password" name="password" defaultValue={this.state.password} autoComplete="off" />
							</div>
						</div>
					</fieldset>
					<input type="submit" value="Save"/>
				</form>
				<p className="ReportLink"><a target="_blank" href="https://github.com/aurer/tomcat-site-manager/issues">Report an issue</a></p>
			</section>
		)
	}

	handleSubmit(e) {
		e.preventDefault();
		let form = e.target;

		let newState = Object.assign({}, this.state, {
			domain: 					this.sanitiseDomainValue(form.domain.value),
			root: 						this.sanitiseRootValue(form.root.value),
			username: 				form.username.value,
			password: 				form.password.value
		});

		form.domain.value = newState.domain;
		form.root.value = newState.root;

		Store.save('settings', newState);
		this.setState(newState);
		notify('Settings updated');
	}

	sanitiseDomainValue(value) {
		return value.replace(/\s+/g, '').replace(':8080', '');
	}

	sanitiseRootValue(value) {
		let ds = getOSSlash();
		return value
			.replace(/\s+/g, '')
			.replace(/[\/\\]/g, ds)
			.replace(/[\/\\]$/g, '') + ds;
	}
}

export default Settings
