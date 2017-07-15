import React from 'react';

class ImportForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		};
	}

	componentWillUnmount() {
		this.setState({error: null});
	}

	render() {
		return(
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field Form-field--slim">
					<div className="Form-inputs">
						<textarea
							name="data"
							cols="30"
							rows="10"
							autoFocus
							placeholder="Paste your JSON config here and click import"
							onKeyUp={this.handleKeys.bind(this)}></textarea>
					</div>
					<div className="Form-field Form-field--checkboxes">
						<div className="Form-inputs">
							<input type="checkbox" name="overwrite" id="overwrite" defaultChecked={false} />
							<label htmlFor="overwrite">Overwrite existing</label>
						</div>
					</div>
				</div>
				{this.state.error && <div className="Form-error">{this.state.error}</div>}
				<button type="submit" className="Button Button--secondary" onClick={this.props.onCancel}>Cancel</button>
				<input type="submit" value="Import"/>
			</form>
		)
	}

	handleKeys(e) {
		if (e.keyCode == 27) {
			this.props.onCancel();
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		let form = e.target;
		let data = form.data.value;
		let overwrite = form.overwrite.checked;

		try {
			data = JSON.parse(data);
		} catch(e) {
			var message = "There was a propblem with the JSON you entered: " + e.toString();
			return this.setState({error: message});
		}

		// Construct sites array
		var newData = {sites:[]};
		data.forEach((site,i) => {
			newData.sites.push({
				name: site.name.toLowerCase(),
				aliases: site.aliases.toLowerCase(),
				root: site.path ? site.path.toLowerCase() : site.root.toLowerCase(),
				id: +new Date + i
			});
		});

		this.props.onSubmit(newData, overwrite);
	}
}

export default ImportForm;
