import React from 'react';
import * as Store from '../store';
import Site from './Site';

const settings = Store.load('settings');

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
			siteId: null
		}
	}

	componentDidMount() {
		this.handleUpdateInputs(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.handleUpdateInputs(nextProps);
	}

	render() {
		return (
			<form className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<label>Site name</label>
					<div className="Form-inputs">
						<input type="text" name="name" autoComplete="off" onChange={this.handleNameValue.bind(this)} value={this.state.nameValue} autoFocus/>
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
						<input type="text" name="root" onChange={this.handleRootValue.bind(this)} value={this.state.rootValue}/>
						{this.state.rootHelper}
					</div>
				</div>
				<div className="Form-field">
					{ this.state.siteId && <input type="hidden" name="siteId" value={this.state.siteId}/>}
					<input type="submit" className="Button" value="Save"/>
				</div>
			</form>
		)
	}

	handleUpdateInputs(props) {
		if (props.site) {
			let site = props.site.front;
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
		let rootHelper = this.buildRootHelper(nameValue);
		this.setState({
			rootValue: nameValue,
			nameValue,
			nameHelper,
			rootHelper
		})
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
		let rootValue = input.value;
		let helper = this.buildRootHelper(rootValue);
		this.setState({
			rootValue,
			rootHelper: helper
		})
	}

	buildNameHelper(value) {
		let helper = '';
		if (value.length) {
			helper = (<div className="Form-helper Form-helper--name">{value}<span>.{settings.domain}</span></div>);
		}
		return helper;
	}

	buildAliasesHelper(value, siteName) {
		let helper = '';
		let name = siteName || this.state.nameValue;
		let domain = settings.domain;
		if (value.length) {
			let helperSpans = value.split(',').map(part => part.replace(' ', ''));
			helper = <div className="Form-helper Form-helper--alias">{helperSpans.map((alias,i) => (<div key={i}>{alias}<span>.{name}.{domain}</span> </div>))}</div>
		}
		return helper;
	}

	buildRootHelper(value) {
		let helper = '';
		if (value.length) {
			helper = (<div className="Form-helper Form-helper--root"><span>{settings.root}/</span>{value}</div>);
		}
		return helper;
	}

	sanitise(value) {
		return value.toLowerCase()
			.replace('.', '')
			.replace(/[\s]+/g, '-');
	}

	handleSubmit(e) {
		this.props.onSubmit(e);
		e.preventDefault();
	}
}

export default SiteForm;
