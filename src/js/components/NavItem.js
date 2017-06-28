import React from 'React';

class NavItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span onClick={this.handleClick.bind(this)} className="Nav-item">{this.props.children}</span>
		)
	}

	handleClick() {
		this.props.onClick({
			title: this.props.children,
			view: this.props.view
		});
	}
}

export default NavItem;
