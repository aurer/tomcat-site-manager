import React from 'React';

class NavItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var className = "Nav-item" + (this.props.active ? ' is-active' : ' is-inactive');
		return (
			<span onClick={this.handleClick.bind(this)} className={className}>{this.props.children}</span>
		)
	}

	handleClick() {
		if (this.props.active) {
			this.props.onClick({
				title: this.props.children,
				view: this.props.view
			});
		} else {
			notify('Please fill in all settings');
		}
	}
}

export default NavItem;
