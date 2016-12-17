import React from 'react';
import { Link, Redirect } from 'react-router';
import * as Store from '../store';
import Vhosts from './Vhosts';

class Popup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: null,
			type: null
		}
	}

	render() {
		return (
			<section className="Section Section--popup">
				<nav className="Nav">
					<Link activeClassName="is-active" className="Nav-item" to="vhosts.html">Vhosts</Link>
					<Link activeClassName="is-active" className="Nav-item" to="sites.html">Sites</Link>
					<Link activeClassName="is-active" className="Nav-item" to="settings.html">Settings</Link>
				</nav>
				{this.state.message && <div className="Message Message--positive">{this.state.message}</div>}
				{React.cloneElement(this.props.children, { showMessage: this.handleShowMessage.bind(this) })}
			</section>
		)
	}

	handleShowMessage(message, type) {
		this.setState({ message, type	});
		setTimeout(() => {
			this.setState({message: null, type: null});
		}, 3000);
	}
}

export default Popup;