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
				<td>
					{this.state.name}
				</td>
				<td>
					{this.state.aliases}
				</td>
				<td>
					{Settings.root}/{this.state.root}
				</td>
			</tr>
		)
	}
}

export default Site
