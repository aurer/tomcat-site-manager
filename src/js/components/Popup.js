import React from 'react';
import { Link, Redirect } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import * as Store from '../store';
import Vhosts from './Vhosts';
import Message from './Message';

const SETTINGS = Store.load('settings');

class Popup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: null,
		}
	}

	componentWillMount() {
		let settings = SETTINGS;
		if (settings.domain.length < 1 || settings.root.length < 1) {
			<Redirect to="settings.html" />
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
				{React.cloneElement(this.props.children, { showMessage: this.handleShowMessage.bind(this) })}
				<Message message={this.state.message} removeMessage={this.removeMessage.bind(this)} />
				<nav className="Nav Nav--base">
					<a className="Nav-item" onClick={this.openManager.bind(this)}>Open Host Manager</a>
				</nav>
			</section>
		)
	}

	handleShowMessage(message, type) {
		this.setState({ message: {text: message, type: type} });
	}

	removeMessage() {
		this.setState({message: null});
	}

	openManager() {
		chrome.tabs.create({url:'http://localhost:8080/host-manager/html/'});
	}
}

export default Popup;
