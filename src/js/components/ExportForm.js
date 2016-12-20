import React from 'react';
import * as Store from '../store';

const SITES = Store.load('sites');

class ExportForm extends React.Component {
	render() {
		let data = JSON.stringify(SITES);
		return(
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<div className="Form-inputs">
						<textarea
							name="data"
							cols="30"
							rows="10"
							autoFocus
							defaultValue={data}
							onKeyUp={this.handleKeys.bind(this)}></textarea>
					</div>
				</div>
				<input type="submit" value="Done"/>
			</form>
		)
	}

	handleKeys(e) {
		if (e.keyCode == 27) {
			this.props.onCancel();
		}
	}

	handleSubmit(e) {
		this.props.onSubmit();
		e.preventDefault();
	}
}

export default ExportForm;
