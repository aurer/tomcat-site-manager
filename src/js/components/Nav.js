import React from 'React';
import NavItem from './NavItem';
import * as Store from '../store';

class Nav extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navitems: [
				{title: 'Vhosts', view: 'Vhosts', active: true},
				{title: 'Sites', view: 'Sites', active: true},
				{title: 'Settings', view: 'Settings', active: true},
			],
			pos: {
				width: '100%',
				left: 0
			}
		}
	}

	componentDidMount() {
		this.setIndicatorTo(this.props.default);
		this.toggleNavigationBasedOnSettings();
		window.addEventListener('onstoragesave', this.toggleNavigationBasedOnSettings.bind(this));
	}

	render() {
		return (
			<nav className="Nav" ref="Nav">
				{this.state.navitems.map(item => <NavItem	key={item.title} onClick={this.handleNavigate.bind(this)} view={item.view} active={item.active}>
						{item.title}
					</NavItem>
				)}
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

	toggleNavigationBasedOnSettings() {
		var settings = Store.load('settings');
		var valid = !(settings.domain == '' || settings.root == '');

		var newNavitems = this.state.navitems.map(item => {
			if (item.view != 'Settings') {
				item.active = valid;
			}
			return item;
		});

		this.setState({navItems: newNavitems});
	}
}

export default Nav;
