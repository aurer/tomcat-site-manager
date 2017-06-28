import React from 'react';
import * as Store from '../store';
import Isvg from 'react-inlinesvg';
import { svgPath } from '../helpers';

class Site extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			over: false
		};
	}

	render() {
		var site = this.props.site;
		var id = this.props.index + site.name;
		var settings = Store.load('settings');
		var nameTitle = site.name + '.' + settings.domain;
		var aliasesTitle = site.aliases.split(',').map(a => `${a}.${site.name}.${settings.domain}`).join(', ');
		var rootTitle = settings.root + site.root;
		var checked = site.active ? 'checked' : '';
		var siteClassName = 'Site ' + (site.active ? 'is-active' : 'is-inactive');
		siteClassName += (this.state.over ? ' over' : '');

		return (
			<div
				className={siteClassName}
				draggable
				onDragStart={this.onDragStart.bind(this)}
				onDragOver={this.onDragOver.bind(this)}
				onDrop={this.onDrop.bind(this)}
			>
				<div className="Site-status">
					<input type="checkbox" id={id} value="true" checked={checked} onChange={this.toggleSite.bind(this)} />
				</div>
				<div className="Site-name" title={nameTitle}>
					{site.name}
				</div>
				<div className="Site-aliases" title={aliasesTitle}>
					{site.aliases}
				</div>
				<div className="Site-root" title={rootTitle}>
					{site.root}
				</div>
				<div className="Site-actions">
					<button className="IconButton Site-actions-edit" onClick={this.handleEditSite.bind(this)} title="Edit">
						<Isvg src={svgPath('edit.svg')} />
					</button>
					<button className="IconButton Site-actions-remove" onClick={this.handleRemoveSite.bind(this)} title="Remove">
						<Isvg src={svgPath('remove.svg')} />
					</button>
				</div>
			</div>
		)
	}

	onDragStart(e) {
		e.dataTransfer.setData("text", this.props.index);
		e.dataTransfer.effectAllowed = "move";
	}

	onDragOver(e) {
		e.preventDefault();
	}

	onDrop(e) {
		var from = e.dataTransfer.getData("text");
		var to = this.props.index;
		e.preventDefault();
		this.props.onReorder(from, to);
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

	toggleSite(e) {
		this.props.onChange({
			action: e.target.checked ? 'activate' : 'deactivate',
			index: this.props.index
		});
	}
}

export default Site
