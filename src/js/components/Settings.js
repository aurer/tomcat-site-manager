import React from 'react';
import * as Store from '../store';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = Store.load('settings');
	}

	componentWillMount() {
		this.setState(Store.load('settings'));
	}

	render() {
		let rootPlacerholder = 'c:\\www\\';
		return (
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<label>Local domain name</label>
					<div className="Form-inputs">
						<input type="text" name="domain" defaultValue={this.state.domain} placeholder="yourname.netxtra.local" autoComplete="off" />
					</div>
				</div>
				<div className="Form-field">
					<label>Web root directory</label>
					<div className="Form-inputs">
						<input type="text" name="root" defaultValue={this.state.root} placeholder={rootPlacerholder} autoComplete="off" />
					</div>
				</div>
				<div className="Form-field">
					<label>Operating System</label>
					<div className="Form-inputs">
						<select name="os" defaultValue={this.state.os} onChange={this.handleOsChange.bind(this)}>
							<option value="win">Windows</option>
							<option value="mac">Mac</option>
							<option value="lin">Linux</option>
						</select>
					</div>
				</div>
				<input type="submit" value="Save"/>
			</form>
		)
	}

	handleSubmit(e) {
		e.preventDefault();
		let form = e.target;

		let newState = Object.assign({}, this.state, {
			domain: 					this.sanitiseDomainValue(form.domain.value),
			root: 						this.sanitiseRootValue(form.root.value, form.os.value),
			os: 							form.os.value
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

	sanitiseRootValue(value, os) {
		let ds = os == 'win' ? '\\' : '/';
		return value
			.replace(/\s+/g, '')
			.replace(/[\/\\]/g, ds)
			.replace(/[\/\\]$/g, '') + ds;
	}

	handleOsChange(e) {
		let os = e.target.value;
		let form = e.target.form;
		this.setState({os});
		let root = form.root;
		let rootValue = this.sanitiseRootValue(root.value, os);
		root.value = rootValue;
		this.setState({root, rootValue});
	}
}

export default Settings
