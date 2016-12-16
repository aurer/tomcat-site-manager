import React from 'react';
import { Link, Redirect } from 'react-router';
import * as Store from '../store';
import Vhosts from './Vhosts';

class Popup extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section className="Section Section--popup">
				<nav className="Nav">
					<Link activeClassName="is-active" className="Nav-item" to="vhosts.html">Vhosts</Link>
					<Link activeClassName="is-active" className="Nav-item" to="sites.html">Sites</Link>
					<Link activeClassName="is-active" className="Nav-item" to="settings.html">Settings</Link>
				</nav>
				{this.props.children}
			</section>
		)
	}
}

export default Popup;
