import React from 'react';
import * as Store from '../store';

class ExportForm extends React.Component {
	componentDidMount() {
		this.textArea.select();
	}

	render() {
		var data = JSON.stringify(Store.load('sites'), null, '\t');
		return(
			<form method="post" className="Form" onSubmit={this.handleSubmit.bind(this)}>
				<fieldset>
					<legend>Export sites</legend>
					<div className="Form-field Form-field--wide">
						<label>JSON Config</label>
						<div className="Form-inputs">
							<textarea
								name="data"
								cols="30"
								rows="10"
								defaultValue={data}
								ref={(textarea) => {this.textArea = textarea}}
								onKeyUp={this.handleKeys.bind(this)}></textarea>
						</div>
					</div>
				</fieldset>
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
