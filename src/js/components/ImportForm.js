import React from 'react';

class ImportForm extends React.Component {
	render() {
		return(
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<div className="Form-inputs">
						<textarea
							name="data"
							cols="30"
							rows="10"
							autoFocus
							placeholder="Paste your JSON config here and click import"
							onKeyUp={this.handleKeys.bind(this)}></textarea>
					</div>
					<div className="Form-field">
						<label htmlFor="overwrite">Overwrite existing</label>
						<div className="Form-inputs">
							<input type="checkbox" name="overwrite" defaultChecked={false} />
						</div>
					</div>
				</div>
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
			return alert(e);
		}

		// Construct sites array
		var newData = {sites:[]};
		data.forEach((site,i) => {
			newData.sites.push({
				name: site.name,
				aliases: site.aliases,
				root: site.path ? site.path : site.root,
				id: +new Date + i
			});
		});

		this.props.onSubmit(newData, overwrite);
	}
}

export default ImportForm;
