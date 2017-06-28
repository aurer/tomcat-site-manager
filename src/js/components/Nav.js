import React from 'React';
import NavItem from './NavItem';

class Nav extends React.Component {
	constructor(props) {
		super(props);
		this.navitems = [
			{title: 'Vhosts', view: 'Vhosts'},
			{title: 'Sites', view: 'Sites'},
			{title: 'Settings', view: 'Settings'},
		]

		this.state = {
			pos: {
				width: '100%',
				left: 0
			}
		}
	}

	componentDidMount() {
		this.setIndicatorTo(this.props.default);
	}

	render() {
		return (
			<nav className="Nav" ref="Nav">
				{this.navitems.map(item => <NavItem key={item.title} onClick={this.handleNavigate.bind(this)} view={item.view}>{item.title}</NavItem>)}
				<span style={{width: this.state.pos.width + 'px', left: this.state.pos.left + 'px'}} className="Nav-indicator"></span>
			</nav>
		)
	}

	handleNavigate(props) {
		this.setIndicatorTo(props.title)
		this.props.onNavigate(props);
	}

	setIndicatorTo(title) {
		const nav = this.refs.Nav;
		const items = Array.prototype.slice.call(nav.querySelectorAll('.Nav-item'));
		const item = items.find(i => i.innerText == title);

		this.setState({
			pos: {
				width: item.offsetWidth,
				left: item.offsetLeft
			}
		});
	}
}

export default Nav;
