import React from 'react';
import * as Store from '../store';
import Site from './Site';
import {correctSlashes} from '../helpers';

class SiteForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nameValue: '',
			aliasesValue: '',
			rootValue: '',
			nameHelper: '',
			aliasesHelper: '',
			rootHelper: '',
			siteId: null,
			error: null,
			shouldAutoCompleteRoot: true,
		}
	}

	componentDidMount() {
		this.settings = Store.load('settings');
		this.handleUpdateInputs(this.props);

		if (this.props.site) {
			this.setState({
				shouldAutoCompleteRoot: false
			})
		}
	}

	componentWillUnmount() {
		this.setState({
			error: null,
		});
	}

	render() {
		return (
			<form className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<fieldset>
					<legend>Add a site</legend>
					<div className="Form-field">
						<label>Site name</label>
						<div className="Form-inputs">
							<input type="text" name="name" autoComplete="off" onChange={this.handleNameValue.bind(this)} value={this.state.nameValue} required autoFocus/>
							{this.state.nameHelper}
						</div>
					</div>
					<div className="Form-field">
						<label>Site aliases</label>
						<div className="Form-inputs">
							<input type="text" name="aliases" autoComplete="off" onChange={this.handleAliasesValue.bind(this)} value={this.state.aliasesValue}/>
							{this.state.aliasesHelper}
						</div>
					</div>
					<div className="Form-field">
						<label>Site root</label>
						<div className="Form-inputs">
							<input type="text" name="root" onChange={this.handleRootValue.bind(this)} value={this.state.rootValue} required/>
							{this.state.rootHelper}
						</div>
					</div>
				</fieldset>
				{ this.state.siteId && <input type="hidden" name="siteId" value={this.state.siteId}/> }
				{ this.state.error && <div className="Form-error">{this.state.error}</div> }
				<input type="submit" className="Button" value="Save"/>
				<button className="Button Button--secondary" onClick={this.props.closeForm}>Cancel</button>
			</form>
		)
	}

	handleUpdateInputs(props) {
		if (props.site) {
			let site = props.site;
			this.setState({
				nameValue: site.name,
				aliasesValue: site.aliases,
				rootValue: site.root,
				nameHelper: this.buildNameHelper(site.name),
				aliasesHelper: this.buildAliasesHelper(site.aliases, site.name),
				rootHelper: this.buildRootHelper(site.root),
				siteId: site.id
			})
		}
	}

	handleNameValue(e) {
		let input = e.target;
		let nameValue = this.sanitise(input.value);
		let nameHelper = this.buildNameHelper(nameValue);

		let newState = {
			nameValue,
			nameHelper
		}

		if (this.state.shouldAutoCompleteRoot) {
			newState.rootValue = nameValue,
			newState.rootHelper = this.buildRootHelper(nameValue)
		}

		this.setState(newState)
	}

	handleAliasesValue(e) {
		let input = e.target;
		let aliasesValue = input.value;
		let aliasesHelper = this.buildAliasesHelper(aliasesValue);
		this.setState({
			aliasesValue,
			aliasesHelper
		})
	}

	handleRootValue(e) {
		let input = e.target;
		let helper = this.buildRootHelper(input.value);
		this.setState({
			rootValue: input.value,
			rootHelper: helper,
			shouldAutoCompleteRoot: false
		})
	}

	buildNameHelper(value) {
		let helper = '';
		if (value.length) {
			helper = (<div className="Form-helper Form-helper--name">{value}<span>.{this.settings.domain}</span></div>);
		}
		return helper;
	}

	buildAliasesHelper(value, siteName) {
		let helper = '';
		let name = siteName || this.state.nameValue;
		let domain = this.settings.domain;
		if (value.length) {
			let helperSpans = value.split(',').map(part => part.replace(' ', ''));
			helper = <div className="Form-helper Form-helper--alias">{helperSpans.map((alias,i) => (<div key={i}>{alias}<span>.{name}.{domain}</span> </div>))}</div>
		}
		return helper;
	}

	buildRootHelper(value) {
		let helper = '';
		if (value.length) {
			value = correctSlashes(value);
			helper = (<div className="Form-helper Form-helper--root"><span>{this.settings.root}</span>{value}</div>);
		}
		return helper;
	}

	sanitise(value) {
		return value.toLowerCase()
			.replace(/[\s]+/g, '-');
	}

	handleSubmit(e) {
		e.preventDefault();
		let form = e.target;

		// Enforce correct slashes for root value
		form.root.value = correctSlashes(form.root.value)

		this.props.onSubmit(e);
	}
}

export default SiteForm;
