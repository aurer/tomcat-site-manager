import React from 'react';
import * as Store from '../store';
import { EditIcon, RemoveIcon } from './Icons';
import * as Stats from './Stats';

class Site extends React.Component {
	constructor(props) {
		super(props);
		this.dragCounter = 0;
		this.state = {
			over: false
		};
	}

	render() {
		const site = this.props.site;
		const id = this.props.id;
		const settings = Store.load('settings');
		const nameTitle = site.name + '.' + settings.domain;
		const aliasesTitle = site.aliases.split(',').map(a => `${a}.${site.name}.${settings.domain}`).join(', ');
		const rootTitle = settings.root + site.root;
		let checked = site.active ? 'checked' : '';
		let siteClassName = 'Site ' + (site.active ? 'is-active' : 'is-inactive');
		siteClassName += (this.state.over ? ' is-over' : '');
		siteClassName += (this.state.dragging ? ' is-dragging' : '');

		return (
			<div
				className={siteClassName}
				draggable
				onDragStart={this.onDragStart.bind(this)}
				onDragOver={this.onDragOver.bind(this)}
				onDragLeave={this.onDragLeave.bind(this)}
				onDragEnd={this.onDragEnd.bind(this)}
				onDrop={this.onDrop.bind(this)}
				id={id}
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
						<EditIcon />
					</button>
					<button className="IconButton Site-actions-remove" onClick={this.handleRemoveSite.bind(this)} title="Remove">
						<RemoveIcon />
					</button>
				</div>
			</div>
		)
	}

	onDragStart(e) {
		e.dataTransfer.setData("text", this.props.index);
		e.dataTransfer.effectAllowed = "move";
		this.setState({
			dragging: true,
			over: false
		});
	}

	onDragOver(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({
			over: true
		})
	}

	onDragLeave(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({
			over: false
		})
	}

	onDragEnd(e) {
		e.preventDefault();
		e.stopPropagation();
		this.setState({
			dragging: false,
			over: false
		});
	}

	onDrop(e) {
		e.preventDefault();
		var from = e.dataTransfer.getData("text");
		var to = this.props.index;
		this.props.onReorder(from, to, true);
		this.setState({
			over: false,
			dragging: false
		});
	}

	handleEditSite(e) {
		this.props.onChange({
			action: 'edit',
			id: this.props.id
		});
	}

	handleRemoveSite(e) {
		this.props.onChange({
			action: 'remove',
			id: this.props.id
		});
		Stats.remove(this.props.site.name);
	}

	toggleSite(e) {
		this.props.onChange({
			action: e.target.checked ? 'activate' : 'deactivate',
			id: this.props.id
		});
	}
}

export default Site
