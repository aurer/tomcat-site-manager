import React from 'react';
import * as Store from '../store';

let Settings = Store.load('settings');

class Site extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.props.site;
	}

	render() {
		return (
			<tr className="Site">
				<td className="Site-name">
					{this.state.name}
				</td>
				<td className="Site-aliases">
					{this.state.aliases}
				</td>
				<td className="Site-root">
					<span>{Settings.root}/</span>{this.state.root}
				</td>
				<td className="Site-actions">
					<button onClick={this.handleRemoveSite.bind(this)}>x</button>
				</td>
			</tr>
		)
	}

	handleRemoveSite(e) {
		this.props.onChange({
			action: 'remove',
			index: this.props.index
		});
	}
}

export default Site
