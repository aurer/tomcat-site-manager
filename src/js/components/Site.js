import React from 'react';
import * as Store from '../store';
import Isvg from 'react-inlinesvg';
import { svgPath } from '../helpers';

const SETTINGS = Store.load('settings');

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
					<span>{SETTINGS.root}</span>{this.state.root}
				</td>
				<td className="Site-actions">
					<button className="IconButton Site-actions-edit" onClick={this.handleEditSite.bind(this)} title="Edit">
						<Isvg src={svgPath('edit.svg')} />
					</button>
					<button className="IconButton Site-actions-remove" onClick={this.handleRemoveSite.bind(this)} title="Remove">
						<Isvg src={svgPath('remove.svg')} />
					</button>
				</td>
			</tr>
		)
	}

	handleEditSite(e) {
		this.props.onChange({
			action: 'edit',
			index: this.props.index
		});
	}

	handleRemoveSite(e) {
		this.props.onChange({
			action: 'remove',
			index: this.props.index
		});
	}
}

export default Site
