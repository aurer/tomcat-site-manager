import React from 'react';
import { Link, Redirect, browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import * as Store from '../store';
import Vhosts from './Vhosts';
import Message from './Message';
import { openTab } from '../helpers';

class Popup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			message: null,
			canAccessTomcat: false,
			navPosition: {
				width: '100%',
				left: 0
			}
		}
	}

	componentWillMount() {
		let settings = Store.load('settings');
		if (settings.domain.length < 1 || settings.root.length < 1) {
			<Redirect to="settings.html" />
		}
	}

	render() {
		return (
			<section className="Section Section--popup">
				<nav className="Nav" ref="Nav">
					<a className="Nav-item" href="index.html" onClick={this.handleNavigation.bind(this)}>Vhosts</a>
					<a className="Nav-item" href="sites.html" onClick={this.handleNavigation.bind(this)}>Sites</a>
					<a className="Nav-item" href="settings.html" onClick={this.handleNavigation.bind(this)}>Settings</a>
					<span style={{width: this.state.navPosition.width + 'px', left: this.state.navPosition.left + 'px'}} className="Nav-indicator"></span>
				</nav>
				{React.cloneElement(this.props.children, { showMessage: this.handleShowMessage.bind(this) })}
				<Message message={this.state.message} clearMessages={this.clearMessages.bind(this)} />
				<nav className="Nav Nav--base">
					<a className="Nav-item" onClick={this.openManager.bind(this)}>Open Host Manager</a>
				</nav>
			</section>
		)
	}

	componentDidMount() {
		// Set nav indicator position
		var nav = this.refs.Nav;
		var path = window.location.pathname;
		nav.querySelectorAll('a').forEach(a => {
			if (a.pathname == path) {
				this.setState({navPosition: {left: a.offsetLeft, width: a.offsetWidth}})
			}
		});
	}
	
	handleNavigation(e) {
		e.preventDefault();
		var link = e.target;
		var to = link.pathname;
		this.setState({navPosition: {left: link.offsetLeft, width: link.offsetWidth}})
		browserHistory.push(to);
	}

	handleShowMessage(message, type) {
		this.setState({ message: {text: message, type: type} });
	}

	openManager() {
		openTab('http://localhost:8080/host-manager/html/');
	}

	clearMessages() {
		this.setState({message: null});
	}
}

export default Popup;
