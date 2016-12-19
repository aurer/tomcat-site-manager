import React from 'react';
import * as Store from '../store';

class ExportForm extends React.Component {
	render() {
		let data = JSON.stringify(Store.load('sites'));
		return(
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<div className="Form-field">
					<div className="Form-inputs">
						<textarea name="data" id="" cols="30" rows="10" defaultValue={data}></textarea>
					</div>
				</div>
				<input type="submit" value="Done"/>
			</form>
		)
	}

	handleSubmit(e) {
		this.props.onSubmit();
		e.preventDefault();
	}
}

export default ExportForm;
